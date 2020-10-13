import jwt_decode from 'jwt-decode'
import React, { createContext, FC, ReactNode, useEffect, useState } from 'react'
import { IUser, IUserContext } from '../../models/user'
import useLocalStorage from '../hooks/useLocalStorage'

export interface UserProviderProps {
  children: ReactNode
}

export const UserContext = createContext<IUserContext | undefined>(undefined)

export const UserProvider: FC<UserProviderProps> = ({
  children,
}: UserProviderProps): JSX.Element => {
  const { storedValue } = useLocalStorage('token', '')
  const [user, setUser] = useState<IUser | undefined>()

  useEffect(() => {
    if (storedValue) {
      setUser(jwt_decode(storedValue))
    }
  }, [storedValue])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
