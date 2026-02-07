export const APP_ROUTES = {
  HOME: 'candidate/home',
  LOGIN: 'login',
  SIGNUP: 'signup',
  ADMIN_LOGIN: 'adminlogin',
  COMPANY_LOGIN: 'companylogin',
  COMPANY_SIGNUP: 'companysignup',
  FORGOT_PASSWORD: 'forgotpassword',
  FORGOT_PASSWORD_EMAIL: 'forgotpassword/email',
  FORGOT_PASSWORD_NEW: 'forgotpassword/newpassword',
  EMAIL_VERIFICATION: 'email/verification',
  EMAIL_FAILED: 'email/failed',
  EMAIL_SUCCESS: 'email/success',
  
  // Candidate
  CANDIDATE: 'candidate',
  CANDIDATE_HOME: 'candidate/home',
  CANDIDATE_PROFILE: 'candidate/profile',
  CANDIDATE_UPDATE_PROFILE: 'candidate/profile/updateprofile',
  CANDIDATE_SETTINGS: 'candidate/settings',
  CANDIDATE_APPLICATIONS: 'candidate/my-applications',
  CANDIDATE_JOBLIST: 'candidate/joblist',
  CANDIDATE_COMPANY_LIST: 'candidate/companylist',
  CANDIDATE_ABOUT_US: 'candidate/about-us',
  
  // Company
  COMPANY: 'company',
  COMPANY_HOME: 'company/home',
  COMPANY_PROFILE: 'company/profile',
  COMPANY_UPDATE_PROFILE: 'company/profile/updateprofile',
  COMPANY_NEW_JOB: 'company/profile/newjob',
  COMPANY_PUBLIC_VIEW: 'company/profile/publicview',
  COMPANY_JOB_VIEW: 'company/profile/jobview',
  COMPANY_INTERNAL_USERS: 'company/internalusers',
  COMPANY_CREATE_USER: 'company/internalusers/createuser',
  COMPANY_USER_PROFILE: 'company/userprofile',
  COMPANY_ALL_APPLICANTS: 'company/all-applicants',
  COMPANY_SCHEDULES: 'company/my-schedules',
  COMPANY_JOBS: 'company/joblist',
  COMPANY_JOB_APPLICATIONS: 'company/joblist/applications',
  COMPANY_VIEW_APPLICATION: 'company/joblist/applications/viewapplication',
  COMPANY_JOB_EDIT: 'company/joblist/jobedit',
  
  // Admin
  ADMIN: 'admin',
  ADMIN_DASHBOARD: 'admin/dashboard',
  ADMIN_COMPANIES: 'admin/companies',
  ADMIN_CANDIDATES: 'admin/candidates',
  ADMIN_JOBS: 'admin/joblist',
  ADMIN_VIEW_JOB: 'admin/joblist/viewjob',
  ADMIN_PROFILE: 'admin/profile',
};

export const PUBLIC_ROUTES = [
  '/',
  `/${APP_ROUTES.HOME}`,
  `/${APP_ROUTES.LOGIN}`,
  `/${APP_ROUTES.SIGNUP}`,
  `/${APP_ROUTES.FORGOT_PASSWORD}`,
  '/email', // Base path for email verification
  `/${APP_ROUTES.ADMIN_LOGIN}`,
  `/${APP_ROUTES.COMPANY_LOGIN}`,
  `/${APP_ROUTES.COMPANY_SIGNUP}`,
  `/${APP_ROUTES.CANDIDATE_JOBLIST}`,
  `/${APP_ROUTES.CANDIDATE_COMPANY_LIST}`
];

export const API_PUBLIC_PATHS = [
  '/auth/refresh',
  'auth/login',
  'auth/register',
  'auth/google',
  'auth/adminlogin',
  'auth/forgotpassword',
  'auth/updatepassword',
  'auth/verify-email',
];
