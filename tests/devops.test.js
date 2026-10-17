const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');

test('DevOps M5 - Containerization Artifacts Integrity', () => {
  // Dockerfile validation
  const dockerfilePath = path.join(ROOT_DIR, 'Dockerfile');
  assert.ok(fs.existsSync(dockerfilePath), 'Dockerfile must exist');
  const dockerfile = fs.readFileSync(dockerfilePath, 'utf-8');
  assert.ok(dockerfile.includes('FROM node:'), 'Dockerfile must use official Node base image');
  assert.ok(dockerfile.includes('EXPOSE 3000'), 'Dockerfile must expose port 3000');
  assert.ok(dockerfile.includes('npm') && dockerfile.includes('start'), 'Dockerfile must run npm start');
  assert.ok(dockerfile.includes('HEALTHCHECK'), 'Dockerfile should specify container healthcheck');
  assert.ok(dockerfile.includes('USER node'), 'Dockerfile should adopt least privilege non-root user');

  // docker-compose.yml validation
  const composePath = path.join(ROOT_DIR, 'docker-compose.yml');
  assert.ok(fs.existsSync(composePath), 'docker-compose.yml must exist');
  const compose = fs.readFileSync(composePath, 'utf-8');
  assert.ok(compose.includes('services:'), 'docker-compose must declare services');
  assert.ok(compose.includes('app:'), 'docker-compose must have app service');
  assert.ok(compose.includes('"3000:3000"'), 'docker-compose must map port 3000');
  assert.ok(compose.includes('NODE_ENV=production'), 'docker-compose must specify production environment');
});

test('DevOps M6 - Monitoring Configurations Integrity', () => {
  // Prometheus config
  const promPath = path.join(ROOT_DIR, 'monitoring', 'prometheus.yml');
  assert.ok(fs.existsSync(promPath), 'monitoring/prometheus.yml must exist');
  const prom = fs.readFileSync(promPath, 'utf-8');
  assert.ok(prom.includes('scrape_configs:'), 'prometheus.yml must include scrape_configs');
  assert.ok(prom.includes('/metrics'), 'prometheus.yml must target /metrics endpoint');
  assert.ok(prom.includes('insiderjobs-portal'), 'prometheus.yml must specify job name');

  // Grafana Dashboard validation
  const dashPath = path.join(ROOT_DIR, 'monitoring', 'dashboard.json');
  assert.ok(fs.existsSync(dashPath), 'monitoring/dashboard.json must exist');
  const dashRaw = fs.readFileSync(dashPath, 'utf-8');
  const dash = JSON.parse(dashRaw);
  assert.ok(Array.isArray(dash.panels), 'dashboard.json must contain panels array');
  assert.ok(dash.panels.length >= 6, 'dashboard must contain multiple telemetry panels');

  // Check required metrics in dashboard
  const expressions = dash.panels
    .filter(p => Array.isArray(p.targets))
    .flatMap(p => p.targets.map(t => t.expr || ''));

  assert.ok(expressions.some(e => e.includes('insiderjobs_up')), 'Dashboard must monitor availability');
  assert.ok(expressions.some(e => e.includes('http_requests_total')), 'Dashboard must monitor request counts');
  assert.ok(expressions.some(e => e.includes('process_cpu_seconds_total')), 'Dashboard must monitor CPU');
  assert.ok(expressions.some(e => e.includes('process_resident_memory_bytes')), 'Dashboard must monitor memory');
  assert.ok(expressions.some(e => e.includes('http_request_duration_seconds')), 'Dashboard must monitor response latency');
});

test('DevOps M7 - Kubernetes Manifests Integrity', () => {
  // Deployment manifest
  const depPath = path.join(ROOT_DIR, 'k8s', 'deployment.yaml');
  assert.ok(fs.existsSync(depPath), 'k8s/deployment.yaml must exist');
  const dep = fs.readFileSync(depPath, 'utf-8');
  assert.ok(dep.includes('kind: Deployment'), 'Must be a Kubernetes Deployment');
  assert.ok(dep.includes('containerPort: 3000'), 'Must specify containerPort 3000');
  assert.ok(dep.includes('replicas:'), 'Must specify replica count');
  assert.ok(dep.includes('livenessProbe:'), 'Must configure liveness probe');
  assert.ok(dep.includes('readinessProbe:'), 'Must configure readiness probe');
  assert.ok(!dep.includes('image: my-image'), 'Must not use placeholder image');

  // Service manifest
  const svcPath = path.join(ROOT_DIR, 'k8s', 'service.yaml');
  assert.ok(fs.existsSync(svcPath), 'k8s/service.yaml must exist');
  const svc = fs.readFileSync(svcPath, 'utf-8');
  assert.ok(svc.includes('kind: Service'), 'Must be a Kubernetes Service');
  assert.ok(svc.includes('type: NodePort'), 'Must configure NodePort service type');
  assert.ok(svc.includes('targetPort: 3000'), 'targetPort must match containerPort 3000');
  assert.ok(svc.includes('app: insiderjobs-portal'), 'Selector must match deployment label');
});
