/**
 * InsiderJobs - Production HTTP Server
 * Serves the job portal web application, recruiter portal, REST API endpoints,
 * and Prometheus /metrics endpoint without external dependencies.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const { DEFAULT_JOBS, filterJobs, paginate, getCategoryCounts } = require('./src/jobService.js');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const ROOT_DIR = __dirname;

// MIME type map for static asset delivery
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// In-memory metrics counters for Prometheus instrumentation
const metrics = {
  requestsTotal: 0,
  requestsByStatus: { 200: 0, 404: 0, 500: 0 },
  requestsByRoute: {},
  requestDurationTotalMs: 0,
  startTime: Date.now()
};

/**
 * Record telemetry metrics for an HTTP transaction
 */
function recordMetric(route, statusCode, durationMs) {
  metrics.requestsTotal += 1;
  metrics.requestsByStatus[statusCode] = (metrics.requestsByStatus[statusCode] || 0) + 1;
  metrics.requestsByRoute[route] = (metrics.requestsByRoute[route] || 0) + 1;
  metrics.requestDurationTotalMs += durationMs;
}

/**
 * Generate standard Prometheus exposition format text
 */
function generatePrometheusMetrics() {
  const mem = process.memoryUsage();
  const uptimeSeconds = (Date.now() - metrics.startTime) / 1000;
  const cpu = process.cpuUsage();
  const cpuSeconds = (cpu.user + cpu.system) / 1000000;
  const avgLatencySeconds = metrics.requestsTotal > 0
    ? (metrics.requestDurationTotalMs / metrics.requestsTotal) / 1000
    : 0;

  let text = '';

  text += '# HELP insiderjobs_up Application availability indicator (1 = up, 0 = down)\n';
  text += '# TYPE insiderjobs_up gauge\n';
  text += 'insiderjobs_up 1\n\n';

  text += '# HELP insiderjobs_uptime_seconds Total runtime of the server process in seconds\n';
  text += '# TYPE insiderjobs_uptime_seconds counter\n';
  text += `insiderjobs_uptime_seconds ${uptimeSeconds.toFixed(2)}\n\n`;

  text += '# HELP http_requests_total Total count of HTTP requests processed\n';
  text += '# TYPE http_requests_total counter\n';
  text += `http_requests_total ${metrics.requestsTotal}\n`;
  for (const [code, count] of Object.entries(metrics.requestsByStatus)) {
    text += `http_requests_total{status="${code}"} ${count}\n`;
  }
  for (const [route, count] of Object.entries(metrics.requestsByRoute)) {
    text += `http_requests_total{route="${route}"} ${count}\n`;
  }
  text += '\n';

  text += '# HELP http_request_duration_seconds Average HTTP request latency in seconds\n';
  text += '# TYPE http_request_duration_seconds gauge\n';
  text += `http_request_duration_seconds ${avgLatencySeconds.toFixed(6)}\n\n`;

  text += '# HELP process_resident_memory_bytes Resident memory size in bytes\n';
  text += '# TYPE process_resident_memory_bytes gauge\n';
  text += `process_resident_memory_bytes ${mem.rss}\n\n`;

  text += '# HELP process_heap_used_bytes Process heap memory currently used in bytes\n';
  text += '# TYPE process_heap_used_bytes gauge\n';
  text += `process_heap_used_bytes ${mem.heapUsed}\n\n`;

  text += '# HELP process_cpu_seconds_total Total CPU time spent by the application process\n';
  text += '# TYPE process_cpu_seconds_total counter\n';
  text += `process_cpu_seconds_total ${cpuSeconds.toFixed(4)}\n\n`;

  text += '# HELP insiderjobs_active_listings Total active job listings catalog count\n';
  text += '# TYPE insiderjobs_active_listings gauge\n';
  text += `insiderjobs_active_listings ${DEFAULT_JOBS.length}\n`;

  return text;
}

/**
 * Handle incoming HTTP requests
 */
const server = http.createServer((req, res) => {
  const start = Date.now();
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Health check endpoint
  if (pathname === '/health' || pathname === '/healthz' || pathname === '/api/health') {
    const healthPayload = JSON.stringify({
      status: 'UP',
      service: 'insiderjobs-portal',
      version: '1.0.0',
      uptime: (Date.now() - metrics.startTime) / 1000,
      timestamp: new Date().toISOString(),
      activeJobs: DEFAULT_JOBS.length,
      memory: {
        rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
      }
    });
    res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
    res.end(healthPayload);
    recordMetric('/health', 200, Date.now() - start);
    return;
  }

  // Prometheus Metrics endpoint
  if (pathname === '/metrics') {
    const metricsPayload = generatePrometheusMetrics();
    res.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4; charset=UTF-8' });
    res.end(metricsPayload);
    recordMetric('/metrics', 200, Date.now() - start);
    return;
  }

  // REST API: Filtered Jobs endpoint
  if (pathname === '/api/jobs') {
    const query = parsedUrl.searchParams.get('query') || '';
    const level = parsedUrl.searchParams.get('level') || '';
    const categories = parsedUrl.searchParams.getAll('category');
    const locations = parsedUrl.searchParams.getAll('location');
    const page = parseInt(parsedUrl.searchParams.get('page'), 10) || 1;
    const pageSize = parseInt(parsedUrl.searchParams.get('pageSize'), 10) || 6;

    const filtered = filterJobs(DEFAULT_JOBS, { query, categories, locations, level });
    const paginated = paginate(filtered, page, pageSize);

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(paginated));
    recordMetric('/api/jobs', 200, Date.now() - start);
    return;
  }

  // REST API: Job Categories Facets
  if (pathname === '/api/categories') {
    const counts = getCategoryCounts(DEFAULT_JOBS);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ categories: counts }));
    recordMetric('/api/categories', 200, Date.now() - start);
    return;
  }

  // Static File Serving
  let relativeFilePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  let fullPath = path.normalize(path.join(ROOT_DIR, relativeFilePath));

  // Security: prevent directory traversal
  if (!fullPath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('403 Forbidden');
    recordMetric('traversal', 403, Date.now() - start);
    return;
  }

  // Directory handling (e.g. /job -> /job/index.html)
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    fullPath = path.join(fullPath, 'index.html');
  }

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600'
    });
    fs.createReadStream(fullPath).pipe(res);
    recordMetric(pathname, 200, Date.now() - start);
    return;
  }

  // 404 Not Found
  res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
  res.end('<h1>404 Not Found</h1><p>The requested resource does not exist.</p><p><a href="/">Back to Home</a></p>');
  recordMetric(pathname, 404, Date.now() - start);
});

// Start listening if run directly
if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`[InsiderJobs Server] Listening on http://${HOST}:${PORT}`);
    console.log(`[InsiderJobs Server] Health check: http://${HOST}:${PORT}/health`);
    console.log(`[InsiderJobs Server] Prometheus metrics: http://${HOST}:${PORT}/metrics`);
  });
}

// Graceful termination
const shutdown = () => {
  console.log('[InsiderJobs Server] Shutting down gracefully...');
  server.close(() => {
    console.log('[InsiderJobs Server] Closed all HTTP connections.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = server;
