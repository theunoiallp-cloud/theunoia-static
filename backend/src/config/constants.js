export const VALID_ROLES = [
  // Engineering
  'Frontend Developer',
  'Backend Developer',
  'Full-Stack Developer',
  'Software Engineer',
  'Web Developer',
  'Mobile App Developer',
  'AI Engineer',
  'Machine Learning Engineer',
  'Data Scientist',
  'Data Analyst',
  'Data Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Site Reliability Engineer',
  'Cybersecurity Engineer',
  'QA Engineer / Software Tester',
  'Embedded Systems Engineer',
  'Blockchain Developer',
  // Design and Product
  'UI Designer',
  'UX Designer',
  'UI/UX Designer',
  'Product Designer',
  'Product Manager',
  'Project Manager',
  'Business Analyst',
  'Technical Writer',
  'UX Researcher',
  // Creative and Marketing
  'Graphic Designer',
  'Video Editor',
  'Motion Graphics Designer',
  'Content Writer',
  'Content Creator',
  'Digital Marketing Specialist',
  'SEO Specialist',
  'Social Media Manager',
  'Brand Designer',
  // Business and Operations
  'Business Development Executive',
  'Sales Executive',
  'Marketing Manager',
  'Operations Manager',
  'Human Resources',
  'Recruiter',
  'Finance and Accounting',
  'Customer Success',
  'Customer Support',
  'Legal and Compliance',
  // Leadership and Other
  'CTO / Technical Lead',
  'Engineering Manager',
  'Team Lead',
  'Founder / Co-Founder',
  'Consultant',
  'Student / Intern',
  'Other'
];

export const ROLE_CATEGORIES = {
  'Engineering': [
    'Frontend Developer',
    'Backend Developer',
    'Full-Stack Developer',
    'Software Engineer',
    'Web Developer',
    'Mobile App Developer',
    'AI Engineer',
    'Machine Learning Engineer',
    'Data Scientist',
    'Data Analyst',
    'Data Engineer',
    'Cloud Engineer',
    'DevOps Engineer',
    'Site Reliability Engineer',
    'Cybersecurity Engineer',
    'QA Engineer / Software Tester',
    'Embedded Systems Engineer',
    'Blockchain Developer'
  ],
  'Design and Product': [
    'UI Designer',
    'UX Designer',
    'UI/UX Designer',
    'Product Designer',
    'Product Manager',
    'Project Manager',
    'Business Analyst',
    'Technical Writer',
    'UX Researcher'
  ],
  'Creative and Marketing': [
    'Graphic Designer',
    'Video Editor',
    'Motion Graphics Designer',
    'Content Writer',
    'Content Creator',
    'Digital Marketing Specialist',
    'SEO Specialist',
    'Social Media Manager',
    'Brand Designer'
  ],
  'Business and Operations': [
    'Business Development Executive',
    'Sales Executive',
    'Marketing Manager',
    'Operations Manager',
    'Human Resources',
    'Recruiter',
    'Finance and Accounting',
    'Customer Success',
    'Customer Support',
    'Legal and Compliance'
  ],
  'Leadership and Other': [
    'CTO / Technical Lead',
    'Engineering Manager',
    'Team Lead',
    'Founder / Co-Founder',
    'Consultant',
    'Student / Intern',
    'Other'
  ]
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,25}$/;

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  return PHONE_REGEX.test(phone.trim());
}

export function sanitizeString(val, maxLength = 1000) {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  if (!str) return null;
  return str.slice(0, maxLength);
}
