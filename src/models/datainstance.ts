export interface IDataInstance {
  company: string
  facility: string
  component: string
  startPeriod?: Date
  endPeriod?: Date
  T: number
  du: number
  populationSize?: number
  failureRates?: number
  comment?: string
  L3: {
    measuringPrinciple?: string
    designMountingPrinciple?: string
    actuationPrinciple?: string
    mediumProperties?: string
    dimension?: string
    locationEnvironment?: string
    application?: string
    diagnosticsConfiguration?: string
    testMaintenanceMonitoringStrategy?: string
  }
  created?: Date
}
