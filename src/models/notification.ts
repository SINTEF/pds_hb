//type TStatus = 'published' | 'approved' | 'not approved' | 'not reviewed'

export interface INotification {
  _id: string
  company: string
  notificationNumber: string
  detectionDate: Date
  equipmentGroupL2: string
  tag: string
  shortText?: string
  longText?: string
  detectionMethod?: string
  F1?: string
  F2?: string
  failureType?: string
  numberOfTests?: number
  created?: Date
  commonError?: string
}
