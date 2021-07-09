//type TStatus = 'published' | 'approved' | 'not approved' | 'not reviewed'

export interface IInventoryInstance {
  _id: string
  company: string
  facility: string
  tag: string
  tagDescription?: string
  equipmentGroupL2: string
  vendor?: string
  equipmentModel?: string
  startDate: Date
  L3: {
    type?: string
    medium?: string
    size?: number
  }
  created?: Date
}
