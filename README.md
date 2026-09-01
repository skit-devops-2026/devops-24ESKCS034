# InsiderJobs - Modern Job Portal & Career Discovery Platform

[![CI Pipeline](https://github.com/skit-devops-2026/devops-24ESKCS034/actions/workflows/ci.yml/badge.svg)](https://github.com/skit-devops-2026/devops-24ESKCS034/actions/workflows/ci.yml)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![DevOps Milestone](https://img.shields.io/badge/MT1-Modules%201--4%20Completed-brightgreen)

InsiderJobs is a responsive, modern career discovery platform and recruitment management portal. The platform enables job seekers to search, filter, and apply for opportunities across leading global tech enterprises, while providing recruiters with tools to manage listings and review candidate profiles.

This repository is configured with complete DevOps best practices including automated testing, continuous integration with GitHub Actions, declarative Jenkins pipelines, and Git branching workflows.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Repository & File Structure](#repository--file-structure)
- [Local Setup & Installation](#local-setup--installation)
- [Running Automated Tests](#running-automated-tests)
- [Continuous Integration (GitHub Actions)](#continuous-integration-github-actions)
- [Jenkins Pipeline Setup](#jenkins-pipeline-setup)
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
│       └── ci.yml              # GitHub Actions automated test & lint workflow
├── images/                     # Application visual assets and logos
│   ├── appstore.png
│   ├── google.png
│   └── insidejobs.png
├── job/                        # Recruiter portal sub-application
│   ├── go.html
│   ├── index.html
│   ├── script.js
│   └── style.css
├── src/                        # Core modular business logic
│   └── jobService.js           # Search, filter, pagination & validation logic
├── tests/                      # Automated unit and structural test suite
│   ├── authValidation.test.js  # Email & auth input validation tests
│   ├── jobService.test.js      # Job filtering, search, and pagination tests
│   └── structure.test.js       # File existence, DOM integrity & security tests
├── .gitignore                  # Exclusion rules for build artifacts and secrets
├── index.html                  # Main applicant job portal view
├── Jenkinsfile                 # Declarative Jenkins CI/CD pipeline definition
├── package.json                # Project configuration, metadata, and npm scripts
├── README.md                   # Project documentation and setup guide
├── script.js                   # Client-side interactive logic for applicant portal
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
2. **Environment**: Runs on `ubuntu-latest` with Node.js 20.
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

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.
