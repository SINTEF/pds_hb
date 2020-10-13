export interface IUser {
  username: string
  email: string
  phoneNr?: string
  companyId?: string
  userGroupType: string
  sub: string
  iat: number
  exp: number
}

export interface IUserGroup {
  type: string
  hasAccessToVendor: boolean
  hasAccessToOperator: boolean
  hasAccessToAdmin: boolean
}

export interface IUserContext {
  user: IUser | undefined
  setUser: (value: IUser | undefined) => void
}
