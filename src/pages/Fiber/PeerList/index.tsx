import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { CopyIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons'
import Content from '../../../components/Content'
import { useSetToast } from '../../../components/Toast'
import { explorerService } from '../../../services/ExplorerService'
import type { Fiber } from '../../../services/ExplorerService/fetcher'
import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import { parseNumericAbbr } from '../../../utils/chart'
import styles from './index.module.scss'

const fields = [
  {
    key: 'name',
    label: 'name',
    transformer: (v: unknown, i: Fiber.Peer.ItemInList) => {
      if (typeof v !== 'string') return v
      return (
        <Tooltip title={v}>
          <div className={styles.name}>
            <Link to={`/fiber/peers/${i.peerId}`}>{v}</Link>
          </div>
        </Tooltip>
      )
    },
  },
  {
    key: 'channelsCount',
    label: 'channels_count',
    transformer: (v: unknown) => {
      if (typeof v !== 'number') return v
      return localeNumberString(v)
    },
  },
  {
    key: 'totalLocalBalance',
    label: 'total_local_balance',
    transformer: (v: unknown) => {
      if (typeof v !== 'string' || Number.isNaN(+v)) return v
      const ckb = shannonToCkb(v)
      const amount = parseNumericAbbr(ckb)
      return (
        <div className={styles.balance}>
          <Tooltip title={`${localeNumberString(ckb)} CKB`}>
            <span>{`${amount} CKB`}</span>
          </Tooltip>
          <small>Share: coming soon</small>
        </div>
      )
    },
  },
  {
    key: 'firstChannelOpenedAt',
    label: 'open_time',
    transformer: () => {
      return <small>Coming soon</small>
    },
  },
  {
    key: 'lastChannelUpdatedAt',
    label: 'update_time',
    transformer: () => {
      return <small>Coming soon</small>
    },
  },
  {
    key: 'peerId',
    label: 'peer_id',
    transformer: (v: unknown) => {
      if (typeof v !== 'string') return v
      return (
        <span className={styles.peerId}>
          <Tooltip title={v}>
            <Link to={`/fiber/peers/${v}`} className="monospace">
              {v.length > 16 ? `${v.slice(0, 8)}...${v.slice(-8)}` : v}
            </Link>
          </Tooltip>
          <button type="button" data-copy-text={v}>
            <CopyIcon />
          </button>
        </span>
      )
    },
  },
  {
    key: 'rpcListeningAddr',
    label: 'rpc_addr',
    transformer: (v: unknown) => {
      if (typeof v !== 'string') return v
      return (
        <span className={styles.rpc}>
          <Tooltip title={v}>
            <span>{v}</span>
          </Tooltip>
          <button type="button" data-copy-text={v}>
            <CopyIcon />
          </button>
          <a href={v} title={v} target="_blank" rel="noopener noreferrer">
            <OpenInNewWindowIcon />
          </a>
        </span>
      )
    },
  },
]

const PeerList = () => {
  const [t] = useTranslation()
  const setToast = useSetToast()

  const { data, refetch: refetchList } = useQuery({
    queryKey: ['fiber', 'peers'],
    queryFn: () => explorerService.api.getFiberPeerList(),
  })

  const list = data?.data.fiberPeers ?? []

  const handleCopy = (e: React.SyntheticEvent) => {
    const elm = e.target
    if (!(elm instanceof HTMLElement)) return
    const { copyText } = elm.dataset
    if (!copyText) return
    e.stopPropagation()
    e.preventDefault()
    navigator?.clipboard.writeText(copyText).then(() => setToast({ message: t('common.copied') }))
  }

  const handleAddPeer = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const form = e.currentTarget

    const { peer_id, peer_name, rpc } = form
    const params: Parameters<typeof explorerService.api.addFiberPeer>[0] = {
      rpc: rpc instanceof HTMLInputElement ? rpc.value : '',
      id: peer_id instanceof HTMLInputElement ? peer_id.value : '',
      name: peer_name instanceof HTMLInputElement ? peer_name.value : undefined,
    }

    if (params.rpc && params.id) {
      try {
        await explorerService.api.addFiberPeer(params)
        setToast({ message: 'submitted' })
        refetchList()
      } catch (e) {
        const message = e instanceof Error ? e.message : JSON.stringify(e)
        setToast({ message })
      }
    }
  }

  return (
    <Content>
      <div className={styles.container} onClick={handleCopy}>
        <table>
          <thead>
            <tr>
              {fields.map(f => {
                return <th key={f.key}>{t(`fiber.peer.${f.label}`)}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {list.map(i => {
              return (
                <tr>
                  {fields.map(f => {
                    const v = i[f.key as keyof typeof i]
                    return <td key={f.key}>{f.transformer?.(v, i) ?? v}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleAddPeer} className={styles.addFiberPeer}>
        <fieldset>
          <label htmlFor="peer_name">{t('fiber.peer.name')}</label>
          <input id="peer_name" placeholder="Peer Alias" />
        </fieldset>
        <fieldset>
          <label htmlFor="rpc">{t('fiber.peer.rpc_addr')}</label>
          <input required id="rpc" placeholder="Peer RPC Address" />
        </fieldset>
        <fieldset>
          <label htmlFor="peer_id">Peer ID</label>
          <input required id="peer_id" placeholder="Peer ID" />
        </fieldset>
        <button type="submit">Submit</button>
      </form>
    </Content>
  )
}

export default PeerList