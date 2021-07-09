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
  workOrder?: string
  activityText?: string
  detectionMethod?: string
  F1?: string
  F2?: string
  failureType?: string
  created?: Date
  commonFailure?: string
  repeatingFailure?: string
  qualityStatus?: boolean
  operatorComment?: string[]
}
