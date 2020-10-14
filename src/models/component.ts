interface IData {
  lambda: number
}

export interface IComponent {
  name: string
  size?: number
  design?: string
  revisionDate?: Date
  remarks?: string
  description?: string
  L3: {
    measuringPrinciple?: Array<string>
    designMountingPrinciple?: Array<string>
    actuationPrinciple?: Array<string>
    mediumProperties?: Array<string>
    dimension?: Array<string>
    locationEnvironment?: Array<string>
    application?: Array<string>
    diagnosticsConfiguration?: Array<string>
    testMaintenanceMonitoringStrategy?: Array<string>
  }
  data: IData // should be array, but which type?
  module: string
  equipmentGroup: string
  created?: Date
  symbolUrl?: string
}
