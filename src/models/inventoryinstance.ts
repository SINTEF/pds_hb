//type TStatus = 'published' | 'approved' | 'not approved' | 'not reviewed'

export interface IInventoryInstance {
  _id: string
  company: string
  facility: string
  tag: string
  equipmentGroupL2: string
  vendor?: string
  equipmentModel?: string
  startDate: Date
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
