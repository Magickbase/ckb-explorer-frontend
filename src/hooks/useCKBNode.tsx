import { useContext, createContext, useState, PropsWithChildren } from 'react'
import { NodeService } from '../services/NodeService'

const NODE_CONNECT_MODE_KEY = 'node_connect_mode'
const NODE_ENDPOINTS = 'node_endpoints'

const loadEndpoints = (): CKBNode[] => {
  const item = localStorage.getItem(NODE_ENDPOINTS)
  try {
    return item ? JSON.parse(item) : []
  } catch {
    return []
  }
}

const saveEndpoints = (nodes: CKBNode[]) => {
  localStorage.setItem(NODE_ENDPOINTS, JSON.stringify(nodes))
}

export interface CKBNode {
  alias: string
  url: string
}

export interface ICKBNodeContext {
  nodes: CKBNode[]
  nodeService: NodeService
  isActivated: boolean
  addNode: (node: CKBNode) => void
  removeNode: (url: string) => void
  editNode: (index: number, node: CKBNode) => void
  switchNode: (url: string) => void
  setIsActivated: (isActivated: boolean) => void
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
  const [nodeService, setNodeService] = useState(new NodeService(defaultEndpoint))
  const [nodes, _setNodes] = useState<CKBNode[]>(loadEndpoints())
  const [isActivated, _setIsActivated] = useState(localStorage.getItem(NODE_CONNECT_MODE_KEY) === 'true')

  const setIsActivated = (value: boolean) => {
    localStorage.setItem(NODE_CONNECT_MODE_KEY, value.toString())
    _setIsActivated(value)
  }

  const setNodes = (nodes: CKBNode[]) => {
    _setNodes(nodes)
    saveEndpoints(nodes)
  }

  const addNode = (node: CKBNode) => {
    setNodes([...nodes, node])
  }

  const removeNode = (url: string) => {
    setNodes(nodes.filter(node => node.url !== url))
  }

  const editNode = (index: number, node: CKBNode) => {
    const newNodes = [...nodes]
    if (!newNodes[index - 1]) return
    newNodes[index - 1] = node
    setNodes(newNodes)
  }

  const switchNode = (url: string) => {
    setNodeService(new NodeService(url))
  }

  return (
    <CKBNodeContext.Provider
      value={{
        nodes: [
          {
            alias: 'Default Node',
            url: defaultEndpoint,
          },
          ...nodes,
        ],
        addNode,
        removeNode,
        editNode,
        switchNode,
        nodeService,
        isActivated,
        setIsActivated,
      }}
    >
      {children}
    </CKBNodeContext.Provider>
  )
}
