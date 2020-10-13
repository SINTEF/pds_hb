export interface IUser {
  _id: string
  username: string
  email: string
  phoneNr?: string
  companyName?: string
  userGroupId: string
  userGroup?: IUserGroup
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
