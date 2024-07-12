import { useContext, createContext, useState, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { isMainnet } from '../utils/chain'
import { NodeService } from '../services/NodeService'

const NODE_CONNECT_MODE_KEY = 'node_connect_mode'
const NODE_CONNECTED_ENDPOINT = 'node_connected_endpoint'
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
  addNode: (node: CKBNode) => boolean
  removeNode: (url: string) => void
  editNode: (index: number, node: CKBNode) => boolean
  switchNode: (url: string) => Promise<void>
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
  const { t } = useTranslation()
  const connectedEndpoint = localStorage.getItem(NODE_CONNECTED_ENDPOINT) ?? defaultEndpoint
  const [nodeService, setNodeService] = useState(new NodeService(connectedEndpoint))
  const [nodes, setNodes] = useState<CKBNode[]>(loadEndpoints())
  const [isActivated, _setIsActivated] = useState(localStorage.getItem(NODE_CONNECT_MODE_KEY) === 'true')

  const setIsActivated = (value: boolean) => {
    localStorage.setItem(NODE_CONNECT_MODE_KEY, value.toString())
    _setIsActivated(value)
  }

  const saveNodes = (nodes: CKBNode[]) => {
    setNodes(nodes)
    saveEndpoints(nodes)
  }

  const addNode = (node: CKBNode) => {
    const existed = nodes.some(n => n.url === node.url)
    if (existed) return false

    saveNodes([...nodes, node])
    return true
  }

  const removeNode = (url: string) => {
    saveNodes(nodes.filter(node => node.url !== url))
  }

  const editNode = (index: number, node: CKBNode) => {
    const newNodes = [...nodes]
    if (!newNodes[index - 1]) return false

    const existed = newNodes.some((n, i) => n.url === node.url && i !== index - 1)
    if (existed) return false

    newNodes[index - 1] = node
    saveNodes(newNodes)
    return true
  }

  const switchNode = async (url: string) => {
    const service = new NodeService(url)
    const res = await service.rpc.getBlockchainInfo().catch(() => {
      throw new Error(t('node.connect_failed'))
    })

    if ((res.chain === 'ckb' && !isMainnet()) || (res.chain === 'ckt' && isMainnet())) {
      throw new Error(t('node.invalid_network'))
    }

    localStorage.setItem(NODE_CONNECTED_ENDPOINT, url)
    setNodeService(service)
  }

  return (
    <CKBNodeContext.Provider
      value={{
        nodes: [
          {
            alias: t('node.default_node'),
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
