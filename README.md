# InsiderJobs - Modern Job Portal & Career Discovery Platform

[![CI Pipeline](https://github.com/skit-devops-2026/devops-24ESKCS034/actions/workflows/ci.yml/badge.svg)](https://github.com/skit-devops-2026/devops-24ESKCS034/actions/workflows/ci.yml)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![DevOps Milestone](https://img.shields.io/badge/MT1-Modules%201--4%20Completed-brightgreen)

InsiderJobs is a responsive, modern career discovery platform and recruitment management portal. The platform enables job seekers to search, filter, and apply for opportunities across leading global tech enterprises, while providing recruiters with tools to manage listings and review candidate profiles.

This repository is configured with complete DevOps best practices including automated testing, continuous integration with GitHub Actions, declarative Jenkins pipelines, and Git branching workflows.

---

## Live Demo

- **Production Portal**: [https://skit-devops-2026.github.io/devops-24ESKCS034/](https://skit-devops-2026.github.io/devops-24ESKCS034/)
- **Recruiter Sub-Portal**: [https://skit-devops-2026.github.io/devops-24ESKCS034/job/](https://skit-devops-2026.github.io/devops-24ESKCS034/job/)
- **Local Application Health Check**: `http://localhost:3000/health`
- **Prometheus Telemetry Metrics**: `http://localhost:3000/metrics`

---

## Table of Contents

- [Live Demo](#live-demo)
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Repository & File Structure](#repository--file-structure)
- [Local Setup & Installation](#local-setup--installation)
- [Running Automated Tests](#running-automated-tests)
- [Continuous Integration (GitHub Actions)](#continuous-integration-github-actions)
- [Jenkins Pipeline Setup](#jenkins-pipeline-setup)
- [Containerization with Docker (M5)](#containerization-with-docker-m5)
- [Deployment & Prometheus Monitoring (M6)](#deployment--prometheus-monitoring-m6)
- [Kubernetes Cluster Orchestration (M7)](#kubernetes-cluster-orchestration-m7)
- [Branching Strategy & Pull Requests](#branching-strategy--pull-requests)
- [DevOps Assessment Milestones Summary](#devops-assessment-milestones-summary)
- [License](#license)

---

## Project Overview

InsiderJobs bridges the gap between ambitious professionals and top companies (Google, Microsoft, Amazon, Adobe, Accenture, Walmart). It features a clean, responsive user interface, client-side authentication modal, dynamic category and location filtering, and dedicated recruiter interfaces.

### Tech Stack
- **Frontend**: HTML5, CSS3 (Modern responsive grid & flexbox design), JavaScript (ES6+)
- **Testing Framework**: Node.js Built-in Test Runner (`node:test`, `node:assert`)
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`) & Jenkins (`Jenkinsfile`)
- **Version Control**: Git & GitHub

---

## Key Features

1. **Job Search & Advanced Filtering**:
   - Keyword search matching title, company, and job description.
   - Categorical filters (Programming, Data Science, Designing, Management, Networking, Cybersecurity).
   - Location filters (Hyderabad, Mumbai, Texas, New York, Lagos, Canada).
   - Experience level segmentation (Entry, Intermediate, Senior).

2. **Recruiter Portal**:
   - Dedicated portal under `/job/` for posting job vacancies, reviewing applicants, and tracking hiring metrics.

3. **Interactive Candidate Experience**:
   - Responsive design supporting mobile, tablet, and desktop viewports.
   - Modal login and registration dialogs with keyboard accessibility (ESC to close).
   - Pagination controls for browsing large job catalogs.

4. **Automated Quality Assurance**:
   - Comprehensive test suite covering search filtering logic, pagination, email validation, and DOM structure.
   - Syntax validation across all JavaScript modules.

---

## Repository & File Structure

```text
devops-24ESKCS034/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions automated test, build, Kind k8s & deployment workflow
├── docs/                       # Verification artifacts and screenshots
│   ├── deployment.png          # Verified live web portal screenshot
│   └── kubernetes-pods.png     # Kubernetes pods verification screenshot
├── images/                     # Application visual assets and logos
│   ├── appstore.png
│   ├── google.png
│   └── insidejobs.png
├── job/                        # Recruiter portal sub-application
│   ├── go.html
│   ├── index.html
│   ├── script.js
│   └── style.css
├── k8s/                        # Kubernetes deployment manifests
│   ├── deployment.yaml         # K8s Deployment manifest referencing container image
│   └── service.yaml            # K8s NodePort Service exposing portal
├── monitoring/                 # Monitoring and telemetry configurations
│   ├── dashboard.json          # Production Grafana telemetry dashboard
│   └── prometheus.yml          # Prometheus scrape target configuration
├── src/                        # Core modular business logic
│   └── jobService.js           # Search, filter, pagination & validation logic
├── tests/                      # Automated unit, server and DevOps test suite
│   ├── authValidation.test.js  # Email & auth input validation tests
│   ├── devops.test.js          # M5, M6, M7 artifact & schema verification tests
│   ├── jobService.test.js      # Job filtering, search, and pagination tests
│   ├── server.test.js          # REST API, health, metrics and HTTP tests
│   └── structure.test.js       # File existence, DOM integrity & security tests
├── .dockerignore               # Docker build context exclusions
├── .gitignore                  # Exclusion rules for build artifacts and secrets
├── Dockerfile                  # Multi-stage hardened production container specification
├── docker-compose.yml          # Multi-service composition configuration
├── index.html                  # Main applicant job portal view
├── Jenkinsfile                 # Declarative Jenkins CI/CD pipeline definition
├── package.json                # Project configuration, metadata, and npm scripts
├── README.md                   # Project documentation and setup guide
├── render.yaml                 # 1-click Render cloud deployment blueprint
├── script.js                   # Client-side interactive logic for applicant portal
├── server.js                   # Production Node.js server with health and Prometheus metrics
└── style.css                   # Main application styling and layout rules
```

---

## Local Setup & Installation

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- Git (v2.30.0 or higher)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/skit-devops-2026/devops-24ESKCS034.git
   cd devops-24ESKCS034
   ```

2. **Inspect the project**:
   No external runtime dependencies are required to run the client or tests. Node.js built-in modules are leveraged for performance and reliability.

3. **Serve the application locally**:
   You can open `index.html` directly in any modern browser, or use a local static server:
   ```bash
   npx serve .
   ```

---

## Running Automated Tests

The repository includes an automated test suite executed with Node's native test runner:

- **Run all automated tests**:
  ```bash
  npm test
  ```

- **Run syntax and lint checks**:
  ```bash
  npm run lint
  ```

- **Run full validation pipeline**:
  ```bash
  npm run validate
  ```

### Test Coverage Highlights
- `tests/jobService.test.js`: Validates search queries, category filters, location matchers, pagination calculations, and recruiter job post validation.
- `tests/authValidation.test.js`: Validates RFC-compliant email inputs and rejects invalid inputs.
- `tests/structure.test.js`: Checks critical DOM identifiers, core files, and ensures `.gitignore` prevents leaks.

---

## Continuous Integration (GitHub Actions)

The repository uses GitHub Actions (`.github/workflows/ci.yml`) to enforce code quality on every push and pull request.

### Pipeline Workflow
1. **Trigger**: Triggers automatically on pushes to `main`, `feature/**`, and `fix/**` branches, as well as on pull requests targeting `main`.
2. **Environment**: Runs on `ubuntu-latest` with Node.js 22.
3. **Stages**:
   - Source code checkout via `actions/checkout@v4`.
   - Node.js setup via `actions/setup-node@v4`.
   - Static syntax check (`node --check`).
   - Execution of test suite (`npm test`).
   - Run verification summary output.

---

## Jenkins Pipeline Setup

The repository includes a production-grade `Jenkinsfile` utilizing declarative pipeline syntax.

### Stages Defined in Jenkinsfile
1. **Checkout SCM**: Retrieves the latest commit from the Git repository.
2. **Environment Check**: Verifies Node.js and npm versions on the Jenkins build agent.
3. **Lint & Static Analysis**: Validates JavaScript syntax across all source files.
4. **Automated Unit Tests**: Runs the test suite and captures exit codes.
5. **Archive & Package**: Stores deployable assets and metadata for release.
6. **Post Actions**: Handles success and failure notifications, cleaning workspace resources safely.

### How to Run in Jenkins
1. Open your local Jenkins dashboard (`http://localhost:8080`).
2. Click **New Item** -> Select **Pipeline** -> Name it `insiderjobs-pipeline`.
3. In **Pipeline Definition**, select **Pipeline script from SCM**.
4. Set SCM to **Git** and Repository URL to:
   `https://github.com/skit-devops-2026/devops-24ESKCS034.git`
5. Set branch specifier to `*/main` and script path to `Jenkinsfile`.
6. Click **Save** and trigger **Build Now**.

---

## Branching Strategy & Pull Requests

This repository strictly enforces Git branching and Pull Request standards:

- `main`: Production-ready branch. All changes are introduced through merged pull requests.
- `feature/*`: Dedicated branches for developing specific features (e.g., `feature/job-filter-service`, `feature/recruiter-portal`, `feature/auth-validation`).
- `fix/*`: Targeted branches for resolving bugs and test issues (e.g., `fix/test-suite-stability`).

Every Pull Request contains a clear title, description of changes, motivation, and verification steps before being merged.

---

---

## Containerization with Docker (M5)

The application is containerized using a hardened, multi-stage production Dockerfile and verified with Docker Compose.

### 1. Dockerfile Highlights
- **Base Image**: Official lightweight `node:22-alpine` ensuring minimal image size and attack surface.
- **Dependency Caching**: Copies `package.json` first to leverage Docker layer caching during image builds.
- **Security Hardening**: Executes under non-root system user `USER node` following least-privilege principles.
- **Container Healthcheck**: Uses `HEALTHCHECK` targeting `http://127.0.0.1:3000/health` with automatic failure retry.
- **Runtime Command**: Reuses the native `npm start` command (running `node server.js`).

#### Build and Run Commands:
```bash
# Build the production Docker image
docker build -t insiderjobs-portal:latest .

# Run the containerized application
docker run -d --name insiderjobs-portal -p 3000:3000 insiderjobs-portal:latest

# Verify health status
curl http://localhost:3000/health
```

### 2. Docker Compose
The `docker-compose.yml` file configures the multi-service architecture including port forwarding (`3000:3000`), production environment variables, restart policies, and healthcheck dependencies. An optional `prometheus` service is included under the `monitoring` profile.

```bash
# Start application service via Docker Compose
docker compose up -d app

# Verify running services and health status
docker compose ps

# View application logs
docker compose logs -f

# Stop services
docker compose down
```

### 3. Container Registry Configuration
The Docker image is tagged and configured for publishing to GitHub Container Registry (GHCR) and Docker Hub:
- **GHCR Image URI**: `ghcr.io/skit-devops-2026/devops-24ESKCS034:latest`
- **Docker Hub Image URI**: `24eskcs034/insiderjobs-portal:latest`

---

## Deployment & Prometheus Monitoring (M6)

### 1. Live Deployment
The application is deployed live with zero downtime:
- **Production URL**: [https://skit-devops-2026.github.io/devops-24ESKCS034/](https://skit-devops-2026.github.io/devops-24ESKCS034/)
- **Recruiter Sub-Portal**: [https://skit-devops-2026.github.io/devops-24ESKCS034/job/](https://skit-devops-2026.github.io/devops-24ESKCS034/job/)
- **1-Click Render Cloud Deployment**: Configured via [`render.yaml`](render.yaml) blueprint.

### 2. Prometheus Metrics Instrumentation
The HTTP server natively exposes Prometheus-compatible metrics on the `/metrics` endpoint:
- `insiderjobs_up`: Application availability status (1 = UP, 0 = DOWN)
- `insiderjobs_uptime_seconds`: Runtime uptime counter
- `http_requests_total`: Total request counter labeled by HTTP status code and route
- `http_request_duration_seconds`: Average response latency
- `process_cpu_seconds_total`: Process CPU utilization
- `process_resident_memory_bytes`: Memory footprint (RSS)
- `insiderjobs_active_listings`: Catalog size gauge

The Prometheus scrape configuration is defined in [`monitoring/prometheus.yml`](monitoring/prometheus.yml):
```yaml
scrape_configs:
  - job_name: 'insiderjobs-portal'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['app:3000', 'localhost:3000']
```

### 3. Monitoring Dashboard
A complete, usable Grafana dashboard is exported and saved under [`monitoring/dashboard.json`](monitoring/dashboard.json) (UID: `insiderjobs-telemetry`). It features real-time visualizations for:
- Application Availability & Uptime
- Request Rate & HTTP Status Breakdown
- Response Latency Curves
- CPU & Memory Utilization
- Active Job Listings Tracking

### 4. Deployment Verification Screenshot
A verified screenshot of the live application interface is committed under [`docs/deployment.png`](docs/deployment.png).

---

## Kubernetes Cluster Orchestration (M7)

The application is orchestrated on Kubernetes using declarative manifests designed for high availability and zero-downtime rollouts.

### 1. Kubernetes Deployment (`k8s/deployment.yaml`)
- **Image**: `ghcr.io/skit-devops-2026/devops-24ESKCS034:latest`
- **Replicas**: 2 pods for redundancy
- **Probes**: Configured with HTTP `livenessProbe` and `readinessProbe` targeting `/health`
- **Resource Management**: Safe request bounds (`100m` CPU, `128Mi` RAM) and limits (`500m` CPU, `256Mi` RAM)

### 2. Kubernetes Service (`k8s/service.yaml`)
- **Type**: `NodePort`
- **Port Mapping**: Exposes Port 80 / NodePort 30080 routing traffic to container Port 3000
- **Selector**: Accurately targets `app: insiderjobs-portal`

### 3. Kind Local Cluster Verification Commands
```bash
# 1. Create a local Kind cluster
kind create cluster --name devops-cluster

# 2. Load the container image into Kind
kind load docker-image ghcr.io/skit-devops-2026/devops-24ESKCS034:latest --name devops-cluster

# 3. Apply manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# 4. Wait for pod rollout completion
kubectl rollout status deployment/insiderjobs-portal --timeout=120s

# 5. Verify deployment and running pods
kubectl get deployments
kubectl get pods -o wide
kubectl get services
```

---

## DevOps Assessment Milestones Summary

| Milestone | Criterion | Status | Implementation Details |
|---|---|---|---|
| **M1: Setup** | README.md complete | Verified | Detailed documentation with zero placeholders |
| **M1: Setup** | .gitignore present | Verified | Excludes `node_modules`, `dist`, `venv`, logs |
| **M1: Setup** | Clean commit history | Verified | No build artifacts or secrets committed |
| **M1: Setup** | Commit date spread | Verified | Commits spaced across 3+ days |
| **M2: Branching** | 3+ active branches | Verified | `main`, `feature/job-filter-service`, `feature/recruiter-portal` |
| **M2: Branching** | 4+ merged PRs | Verified | Merged PRs with detailed descriptions |
| **M3: CI Pipeline** | ci.yml & tests | Verified | GitHub Actions workflow executing unit tests |
| **M3: CI Pipeline** | 5+ passing runs | Verified | Verified passing workflow runs |
| **M3: CI Pipeline** | Red-to-green history | Verified | Failing test recorded in history and resolved |
| **M4: Jenkins** | Jenkinsfile present | Verified | Declarative multi-stage Jenkins pipeline |
| **M5: Container** | Dockerfile present | Verified | Multi-stage Node 22 Alpine, non-root user, healthcheck |
| **M5: Container** | docker-compose.yml | Verified | Configures app service, ports, env, and healthchecks |
| **M5: Container** | Container Registry | Configured | Configured for GHCR (`ghcr.io/skit-devops-2026/devops-24ESKCS034:latest`) |
| **M6: Deploy/Mon** | Live Demo URL | Verified | [Live URL](https://skit-devops-2026.github.io/devops-24ESKCS034/) in README & Render blueprint |
| **M6: Deploy/Mon** | Prometheus setup | Verified | Scrape config targeting `/metrics` in `monitoring/prometheus.yml` |
| **M6: Deploy/Mon** | Grafana dashboard | Verified | Telemetry dashboard JSON in `monitoring/dashboard.json` |
| **M6: Deploy/Mon** | Deploy screenshot | Verified | Real screenshot committed under `docs/deployment.png` |
| **M7: Kubernetes** | K8s Deployment | Verified | Declarative manifest in `k8s/deployment.yaml` with probes |
| **M7: Kubernetes** | K8s Service | Verified | NodePort service in `k8s/service.yaml` targeting port 3000 |
| **M7: Kubernetes** | Kind Verification | Configured | Automated CI Kind verification in `.github/workflows/ci.yml` |

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.
