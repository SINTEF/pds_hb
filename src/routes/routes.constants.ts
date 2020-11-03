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
  ADMIN_COMPANY: '/admin-company',
  REGISTER: '/register',
  UPDATE: '/update/:datainstanceId',
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

export const ADMIN_SUB_ROUTES = {
  SEE_ALL_EDITS: '/edits',
  USER: '/user', // this can be the same as for comapny but the userpage should be dynamic dependng on usergrouptype
  ADD_COMPANY: '/add-company',
  APPROVE_USERS: '/approve-users',
}

export default MAIN_ROUTES
