export interface IUser {
  username: string
  email: string
  phoneNr?: string
  companyId?: string
  userGroupId: string
  userGroup?: IUserGroup
}

export interface IUserGroup {
  type: string
  hasAccessToVendor: boolean
  hasAccessToOperator: boolean
  hasAccessToAdmin: boolean
}

export interface IUserContext {
  user: IUser | undefined
  setUser: (value: IUser) => void
}
