export enum AppActions {
  UpdateModal = 'updateModal',
  ShowToastMessage = 'showToastMessage',
  UpdateAppErrors = 'updateAppErrors',
  UpdateAppLanguage = 'updateAppLanguage',
  UpdateHardForkStatus = 'updateHardForkStatus',
}

export enum ComponentActions {
  UpdateHeaderMobileMenuVisible = 'updateHeaderMobileMenuVisible',
  UpdateHeaderSearchBarVisible = 'updateHeaderSearchBarVisible',
  UpdateMaintenanceAlertVisible = 'updateMaintenanceAlertVisible',
}

export type StateActions = AppActions | ComponentActions

// eslint-disable-next-line no-undef
export default StateActions
