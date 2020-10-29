const MAIN_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  READ: '/read',
  BROWSE: '/browse',
  ADD: '/add',
  COMPANY: '/company',
  ACCOUNT: '/account',
  ADMIN: '/admin',
  NOT_FOUND: '*',
}

export const COMPANY_SUB_ROUTES = {
  REG_DATA: '/registered-data',
  USER: '/user',
  MANAGE_FAC: '/manage-facility',
  MANAGE_STAFF: '/manage-staff',
}

export const SUB_ROUTES = {
  VIEW: '/view/:componentName',
}

export default MAIN_ROUTES
