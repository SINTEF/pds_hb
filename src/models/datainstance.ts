type TStatus = 'published' | 'unpublished' | 'new'

export interface IDataInstance {
  _id: string
  company: string
  facility: string
  component: string
  startDate?: Date
  endDate?: Date
  T: number
  du: number
  populationSize?: number
  failureRate?: number
  comment?: string
  sintefComment?: string
  status?: TStatus
  /*L3: {
    measuringPrinciple?: string
    designMountingPrinciple?: string
    actuationPrinciple?: string
    mediumProperties?: string
    dimension?: string
    locationEnvironment?: string
    application?: string
    diagnosticsConfiguration?: string
    testMaintenanceMonitoringStrategy?: string
  }*/
  created?: Date
}
