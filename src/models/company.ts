export interface ICompany {
  organizationNr: {
    type: string
  }
  name: {
    type: string
  }
  email: {
    type: string
  }
  phoneNr: {
    type: string
  }
  description: {
    type: string
  }
  facilities: [{ type: string }]
  maxUsers: {
    type: number
  }
  created: { type: Date }
}
