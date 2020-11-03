export interface IUser {
  _id: string
  username: string
  email: string
  phoneNr?: string
  companyName?: string
  userGroupType: 'general_user' | 'admin' | 'operator' | 'vendor' | 'none'
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
