/**
 * InsiderJobs - Job Service & Business Logic
 * Provides filtering, search, pagination, and validation logic.
 */

const DEFAULT_JOBS = [
  {
    id: 1,
    title: 'Cloud Engineer',
    company: 'Google',
    location: 'Hyderabad',
    level: 'Intermediate Level',
    category: 'Networking',
    description: 'We are seeking a Cloud Engineer to protect our organization\'s IT infrastructure, implement security measures...',
    postedDate: '2026-08-20'
  },
  {
    id: 2,
    title: 'Network Security Engineer',
    company: 'Google',
    location: 'Canada',
    level: 'Senior Level',
    category: 'Cybersecurity',
    description: 'We are seeking a Network Security Engineer to protect our organization\'s IT infrastructure, implement security measures...',
    postedDate: '2026-08-22'
  },
  {
    id: 3,
    title: 'Software Tester',
    company: 'Google',
    location: 'Texas',
    level: 'Intermediate Level',
    category: 'Programming',
    description: 'As a Software Tester, you will play a critical role in ensuring the quality and reliability of our software products...',
    postedDate: '2026-08-25'
  },
  {
    id: 4,
    title: 'Graphic Designer',
    company: 'Google',
    location: 'Lagos',
    level: 'Intermediate Level',
    category: 'Designing',
    description: 'Join our creative team as a Graphic Designer, where you’ll design visually stunning graphics and layouts...',
    postedDate: '2026-08-28'
  },
  {
    id: 5,
    title: 'Content Marketing Manager',
    company: 'Google',
    location: 'Mumbai',
    level: 'Senior Level',
    category: 'Management',
    description: 'We are looking for a Content Marketing Manager to develop and execute content strategies that drive engagement...',
    postedDate: '2026-08-29'
  },
  {
    id: 6,
    title: 'Human Resources Specialist',
    company: 'Google',
    location: 'New York',
    level: 'Intermediate Level',
    category: 'Management',
    description: 'As a Human Resources Specialist, you will manage recruitment, employee relations, and organizational development...',
    postedDate: '2026-08-30'
  }
];

/**
 * Filter jobs according to user criteria
 * @param {Array} jobs - List of job objects
 * @param {Object} criteria - Filters: query, categories, locations, level
 * @returns {Array} Filtered list of jobs
 */
function filterJobs(jobs = DEFAULT_JOBS, criteria = {}) {
  const { query, categories = [], locations = [], level } = criteria;

  return jobs.filter(job => {
    // Search query matching (title, company, description)
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      const matchesTitle = job.title.toLowerCase().includes(q);
      const matchesCompany = job.company.toLowerCase().includes(q);
      const matchesDesc = job.description.toLowerCase().includes(q);
      if (!matchesTitle && !matchesCompany && !matchesDesc) {
        return false;
      }
    }

    // Category filter
    if (categories.length > 0) {
      const catMatches = categories.some(c => c.toLowerCase() === job.category.toLowerCase());
      if (!catMatches) return false;
    }

    // Location filter
    if (locations.length > 0) {
      const locMatches = locations.some(l => l.toLowerCase() === job.location.toLowerCase());
      if (!locMatches) return false;
    }

    // Level filter
    if (level && level.trim() !== '') {
      if (job.level.toLowerCase() !== level.toLowerCase()) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Paginate job items
 * @param {Array} items
 * @param {number} page (1-based)
 * @param {number} pageSize
 * @returns {Object} { totalItems, totalPages, currentPage, items }
 */
function paginate(items, page = 1, pageSize = 3) {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safePageSize = Math.max(1, parseInt(pageSize, 10) || 3);
  const totalPages = Math.ceil(items.length / safePageSize) || 1;
  const clampedPage = Math.min(safePage, totalPages);
  const startIndex = (clampedPage - 1) * safePageSize;
  const paginatedItems = items.slice(startIndex, startIndex + safePageSize);

  return {
    totalItems: items.length,
    totalPages,
    currentPage: clampedPage,
    items: paginatedItems
  };
}

/**
 * Validate email address format
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate job posting fields
 * @param {Object} job
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateJobPost(job) {
  const errors = [];
  if (!job || typeof job !== 'object') {
    return { valid: false, errors: ['Job payload must be an object'] };
  }

  if (!job.title || job.title.trim().length < 3) {
    errors.push('Job title must be at least 3 characters long');
  }
  if (!job.company || job.company.trim().length < 2) {
    errors.push('Company name must be at least 2 characters long');
  }
  if (!job.location || job.location.trim().length < 2) {
    errors.push('Location must be specified');
  }
  if (!job.category || job.category.trim().length < 2) {
    errors.push('Category must be specified');
  }
  if (!job.description || job.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  DEFAULT_JOBS,
  filterJobs,
  paginate,
  validateEmail,
  validateJobPost
};
