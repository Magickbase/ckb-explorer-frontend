import { FC, PropsWithChildren, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCKBNode } from '../../../hooks/useCKBNode'
import CommonModal from '../../CommonModal'
import { HelpTip } from '../../HelpTip'
import { Switch } from '../../ui/Switch'
import CloseIcon from '../../../assets/modal_close.png'
import { ReactComponent as EditIcon } from './edit.svg'
import { ReactComponent as DeleteIcon } from './delete.svg'

import BackIcon from './back.png'
import styles from './style.module.scss'

const NodeEditForm: FC<
  PropsWithChildren<{
    initialData?: { alias: string; url: string }
    onSubmit: (data: { alias: string; url: string }) => void
  }>
> = ({ children, initialData, onSubmit }) => {
  const [alias, setAlias] = useState(initialData?.alias ?? '')
  const [url, setUrl] = useState(initialData?.url ?? '')

  return (
    <form
      className={styles.nodeEditForm}
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        onSubmit({ alias, url })
      }}
    >
      <div>
        <label>Alias</label>
        <input value={alias} onChange={e => setAlias(e.target.value)} />
      </div>

      <div>
        <label>RPC URL</label>
        <input value={url} onChange={e => setUrl(e.target.value)} />
      </div>

      {children}
    </form>
  )
}

export const CKBNodeModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const { isActivated, setIsActivated, nodeService, nodes, addNode, removeNode, switchNode, editNode } = useCKBNode()
  const [panel, setPanel] = useState<'main' | 'add' | 'edit'>('main')
  const [editIndex, setEditIndex] = useState(0)

  const NodeEditPanel = () => (
    <div className={styles.contentWrapper}>
      <div className={styles.modalTitle}>
        <button type="button" onClick={() => setPanel('main')} className={styles.closeBtn}>
          <img src={BackIcon} alt="back icon" />
        </button>

        <p>{t('node.modify_node')}</p>
        <button type="button" onClick={onClose} className={styles.closeBtn}>
          <img src={CloseIcon} alt="close icon" />
        </button>
      </div>

      <NodeEditForm
        initialData={nodes[editIndex]}
        onSubmit={data => {
          editNode(editIndex, data)
          setPanel('main')
        }}
      >
        <button type="submit" className={styles.btn}>
          {t('node.modify_node')}
        </button>
      </NodeEditForm>
    </div>
  )

  const NodeMainPanel = () => (
    <div className={styles.contentWrapper}>
      <div className={styles.modalTitle}>
        <p>{t('navbar.node')}</p>
        <button type="button" onClick={onClose} className={styles.closeBtn}>
          <img src={CloseIcon} alt="close icon" />
        </button>
      </div>

      <div className={styles.switcher}>
        <label htmlFor="node-connect-mode">{t('node.node_connect_mode')}</label>
        <HelpTip title={t('node.node_connect_tooltip')} />
        <Switch
          id="node-connect-mode"
          style={{ marginLeft: 'auto' }}
          checked={isActivated}
          onCheckedChange={checked => setIsActivated(checked)}
        />
      </div>

      <div className={styles.nodeList}>
        {nodes.map((n, index) => (
          <div className={styles.node} key={n.url}>
            <div className={styles.nodeTitle}>
              <input onClick={() => switchNode(n.url)} type="checkbox" checked={nodeService.nodeEndpoint === n.url} />
              <div className={styles.nodeAlias}>{n.alias}</div>
              {index !== 0 && (
                <>
                  {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                  <span
                    onClick={() => {
                      setPanel('edit')
                      setEditIndex(index)
                    }}
                    style={{ marginLeft: 'auto' }}
                  >
                    <EditIcon width={16} />
                  </span>
                  {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                  <span onClick={() => removeNode(n.url)}>
                    <DeleteIcon width={16} />
                  </span>
                </>
              )}
            </div>
            <div className={styles.nodeSubtitle}>({n.url})</div>
          </div>
        ))}
      </div>

      <button type="button" className={styles.btn} style={{ width: '100%' }} onClick={() => setPanel('add')}>
        {t('node.add_node')}
      </button>
    </div>
  )

  const NodeAddPanel = () => (
    <div className={styles.contentWrapper}>
      <div className={styles.modalTitle}>
        <button type="button" onClick={() => setPanel('main')} className={styles.closeBtn}>
          <img src={BackIcon} alt="back icon" />
        </button>

        <p>{t('node.add_node')}</p>
        <button type="button" onClick={onClose} className={styles.closeBtn}>
          <img src={CloseIcon} alt="close icon" />
        </button>
      </div>

      <NodeEditForm
        onSubmit={data => {
          addNode({ alias: data.alias, url: data.url })
          setPanel('main')
        }}
      >
        <button type="submit" className={styles.btn}>
          {t('node.add_node')}
        </button>
      </NodeEditForm>
    </div>
  )

  return (
    <CommonModal isOpen onClose={onClose}>
      <div ref={ref} className={styles.modalWrapper}>
        {panel === 'main' && <NodeMainPanel />}
        {panel === 'add' && <NodeAddPanel />}
        {panel === 'edit' && <NodeEditPanel />}
      </div>
    </CommonModal>
  )
}
