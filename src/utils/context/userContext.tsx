import jwt_decode from 'jwt-decode'
import React, { createContext, FC, ReactNode, useState } from 'react'
import { IUser, IUserContext } from '../../models/user'

export interface UserProviderProps {
  children: ReactNode
}

export const UserContext = createContext<IUserContext | undefined>(undefined)

export const UserProvider: FC<UserProviderProps> = ({
  children,
}: UserProviderProps): JSX.Element => {
  const getJWTOrUndefined = (): IUser | undefined => {
    try {
      return jwt_decode(localStorage.getItem('token') ?? '') as IUser
    } catch {
      return undefined
    }
  }

  const [user, setUser] = useState<IUser | undefined>(getJWTOrUndefined())

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
