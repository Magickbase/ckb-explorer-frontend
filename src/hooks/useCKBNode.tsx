import { useContext, createContext, useState, PropsWithChildren } from 'react'
import { NodeService } from '../services/NodeService'

export interface ICKBNodeContext {
  nodeService: NodeService
  activate: boolean
  setActivate: (activate: boolean) => void
}

export const CKBNodeContext = createContext<ICKBNodeContext | undefined>(undefined)

export const useCKBNode = (): ICKBNodeContext => {
  const context = useContext(CKBNodeContext)
  if (!context) {
    throw new Error('No CKBNodeContext.Provider found when calling useCKBNode.')
  }
  return context
}

interface CKBNodeProviderProps {
  defaultEndpoint: string
}

export const CKBNodeProvider = ({ children, defaultEndpoint }: PropsWithChildren<CKBNodeProviderProps>) => {
  const nodeService = new NodeService(defaultEndpoint)
  const [activate, setActivate] = useState(false)

  return <CKBNodeContext.Provider value={{ nodeService, activate, setActivate }}>{children}</CKBNodeContext.Provider>
}
