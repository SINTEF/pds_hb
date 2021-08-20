const MAIN_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  READ: '/read',
  BROWSE: '/browse',
  ADD: '/add',
  ADD_COMPONENT: '/add-component/:groupModule/:equipmentGroup',
  COMPANY: '/company',
  ACCOUNT: '/account',
  ADMIN: '/admin',
  NOT_FOUND: '*',
  ADMIN_COMPANY: '/admin-company',
  REGISTER: '/register',
  NOTIFICATIONS: '/notifications',
  ADD_NOTIFICATIONS: '/notifications/add-notifications',
  EDIT_NOTIFICATION: '/notifications/:notificationId',
  INVENTORY: '/inventory',
  ADD_INVENTORY: '/inventory/add-inventory',
  EDIT_INVENTORY: '/inventory/edit-inventory/:inventoryInstanceId',
  ANALYSIS: '/analysis',
  ADD_NOTIFICATION_GROUP: '/notifications/add-notification-group',
  ADD_COMMON_CAUSE_FAILURE: '/notifications/add-common-cause-failure',
  ADD_REPEATING_FAILURE: '/notifications/add-repeating-failure',
  PERIODS: '/periods',
  SEE_ALL_EDITS: '/edits',
}

export const COMPANY_SUB_ROUTES = {
  REG_DATA: '/registered-data',
  USER: '/user',
  MANAGE_FAC: '/manage-facility',
  MANAGE_STAFF: '/manage-staff',
}

export const SUB_ROUTES = {
  VIEW: '/view/:componentName',
  UPDATE: '/update/:datainstanceId',
}

export const ADMIN_SUB_ROUTES = {
  SEE_ALL_EDITS: '/edits',
  USER: '/user', // this can be the same as for comapny but the userpage should be dynamic dependng on usergrouptype
  ADD_COMPANY: '/add-company',
  APPROVE_USERS: '/approve-users',
}

export default MAIN_ROUTES
