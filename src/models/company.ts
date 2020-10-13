export interface ICompany {
  organizationNr: string
  name: string
  email?: string
  phoneNr?: string
  description?: string
  facilities?: Array<string>
  created?: Date
  maxUsers: number
}
