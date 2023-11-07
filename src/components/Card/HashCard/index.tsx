import type { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Radio, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutLiteProfessional } from '../../../constants/common'
import CopyIcon from './copy.png'
import { explorerService } from '../../../services/ExplorerService'
import SmallLoading from '../../Loading/SmallLoading'
import { useIsMobile, useNewAddr, useDeprecatedAddr, useSearchParams, useUpdateSearchParams } from '../../../utils/hook'
import SimpleButton from '../../SimpleButton'
import { ReactComponent as OpenInNew } from '../../../assets/open_in_new.svg'
import { ReactComponent as DownloadIcon } from './download_tx.svg'
import { HashCardPanel, LoadingPanel } from './styled'
import styles from './styles.module.scss'
import AddressText from '../../AddressText'
import { useDASAccount } from '../../../contexts/providers/dasQuery'
import { useSetToast } from '../../Toast'

const DASInfo: FC<{ address: string }> = ({ address }) => {
  const alias = useDASAccount(address)

  if (alias == null) return null

  return (
    <Tooltip placement="top" title={alias}>
      <a className={styles.dasAccount} href={`https://data.did.id/${alias}`} target="_blank" rel="noreferrer">
        <img src={`https://display.did.id/identicon/${alias}`} alt={alias} />
        <span>{alias}</span>
      </a>
    </Tooltip>
  )
}

export default ({
  title,
  hash,
  loading,
  specialAddress = '',
  iconUri,
  children,
  showDASInfoOnHeader,
}: {
  title: string
  hash: string
  loading?: boolean
  specialAddress?: string
  iconUri?: string
  children?: ReactNode
  showDASInfoOnHeader?: boolean | string
}) => {
  const isMobile = useIsMobile()
  const { Professional, Lite } = LayoutLiteProfessional
  const setToast = useSetToast()
  const { t } = useTranslation()

  const isTx = t('transaction.transaction') === title
  const newAddr = useNewAddr(hash)
  const deprecatedAddr = useDeprecatedAddr(hash)
  const counterpartAddr = newAddr === hash ? deprecatedAddr : newAddr

  const searchParams = useSearchParams('layout')
  const defaultLayout = Professional
  const updateSearchParams = useUpdateSearchParams<'layout'>()
  const layout = searchParams.layout === Lite ? Lite : defaultLayout

  const onChangeLayout = (layoutType: LayoutLiteProfessional) => {
    updateSearchParams(params =>
      layoutType === defaultLayout
        ? Object.fromEntries(Object.entries(params).filter(entry => entry[0] !== 'layout'))
        : { ...params, layout: layoutType },
    )
  }

  const handleExportTxClick = async () => {
    const raw = await explorerService.api.fetchTransactionRaw(hash).catch(error => {
      setToast({ message: error.message })
    })
    if (typeof raw !== 'object') return

    const blob = new Blob([JSON.stringify(raw, null, 2)])

    const link = document.createElement('a')
    link.download = `tx-${hash}.json`
    link.href = URL.createObjectURL(blob)
    document.body.append(link)
    link.click()
    link.remove()
  }

  return (
    <HashCardPanel isColumn={!!iconUri}>
      <div className="hashCardContentPanel" id="hash_content">
        {iconUri && isMobile ? (
          <div>
            <img className="hashIcon" src={iconUri} alt="hash icon" />
            <div className="hashTitle">{title}</div>
          </div>
        ) : (
          <>
            {iconUri && <img className="hashIcon" src={iconUri} alt="hash icon" />}
            <div className="hashTitle">{title}</div>
          </>
        )}
        <div className={styles.hashCardHeaderRight}>
          <div className="hashCardHashContent">
            {loading ? (
              <LoadingPanel>
                <SmallLoading />
              </LoadingPanel>
            ) : (
              <div id="hash__text">
                <AddressText disableTooltip fontKey={isMobile}>
                  {hash}
                </AddressText>
              </div>
            )}
            <SimpleButton
              className="hashCopyIcon"
              onClick={() => {
                navigator.clipboard.writeText(hash)
                setToast({ message: t('common.copied') })
              }}
            >
              {!loading && <img src={CopyIcon} alt="copy" />}
            </SimpleButton>
            {counterpartAddr ? (
              <Tooltip
                placement="top"
                title={t(`address.${newAddr === hash ? 'visit-deprecated-address' : 'view-new-address'}`)}
              >
                <a
                  href={`${window.location.href.split('/address/')[0]}/address/${counterpartAddr}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.openInNew}
                >
                  <OpenInNew />
                </a>
              </Tooltip>
            ) : null}
            {isTx ? (
              <Tooltip placement="top" title={t(`transaction.export-transaction`)}>
                <button className={styles.exportTx} onClick={handleExportTxClick} type="button">
                  <DownloadIcon />
                </button>
              </Tooltip>
            ) : null}
          </div>

          {!isMobile && isTx && !loading ? (
            <div className={styles.professionalLiteBox}>
              <Radio.Group
                className={styles.layoutButtons}
                options={[
                  { label: t('transaction.professional'), value: Professional },
                  { label: t('transaction.lite'), value: Lite },
                ]}
                onChange={({ target: { value } }) => onChangeLayout(value)}
                value={layout}
                optionType="button"
                buttonStyle="solid"
              />
            </div>
          ) : null}

          {(showDASInfoOnHeader || showDASInfoOnHeader === '') && (
            <DASInfo address={typeof showDASInfoOnHeader === 'string' ? showDASInfoOnHeader : hash} />
          )}
        </div>
        {specialAddress && (
          <Tooltip title={t('address.vesting_tooltip')} placement={isMobile ? 'bottomRight' : 'bottom'}>
            <Link to={`/address/${specialAddress}`} className="hashVesting">
              {t('address.vesting')}
            </Link>
          </Tooltip>
        )}
        <div id="hash__value" className="monospace">
          {hash}
        </div>
      </div>

      {isMobile && isTx && !loading ? (
        <div className={styles.professionalLiteBox}>
          <Radio.Group
            className={styles.layoutButtons}
            options={[
              { label: t('transaction.professional'), value: Professional },
              { label: t('transaction.lite'), value: Lite },
            ]}
            onChange={({ target: { value } }) => onChangeLayout(value)}
            value={layout}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
      ) : null}

      {children}
    </HashCardPanel>
  )
}
