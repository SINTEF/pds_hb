type TStatus = 'common' | 'repeating'
export interface INotificationGroup {
  _id: string
  company: string
  name: string
  description: string
  type: TStatus
  failureMode: string
}
