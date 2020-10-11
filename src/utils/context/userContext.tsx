import jwt_decode from 'jwt-decode'
import React, { createContext, FC, ReactNode, useEffect, useState } from 'react'
import { IUser, IUserContext } from '../../models/user'
import useLocalStorage from '@rooks/use-localstorage'

export interface UserProviderProps {
  children: ReactNode
}

export const UserContext = createContext<IUserContext | undefined>(undefined)

export const UserProvider: FC<UserProviderProps> = ({
  children,
}: UserProviderProps): JSX.Element => {
  const [value] = useLocalStorage('token')
  const [user, setUser] = useState<IUser>()

  useEffect(() => {
    const storedUser = jwt_decode(value) as IUser
    if (storedUser) {
      setUser(storedUser)
    }
  }, [value])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
