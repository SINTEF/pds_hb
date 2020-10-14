export interface ICompany {
  organizationNr: {
    type: string
    required: true
  }
  name: {
    type: string
    required: true
    unique: true
  }
  email: {
    type: string
    required: true
    unique: true
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
    required: true
  }
  created: { type: Date }
}
