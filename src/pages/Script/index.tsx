import { useState } from 'react'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { TFunction, useTranslation } from 'react-i18next'
import { Link } from '../../components/Link'
import Content from '../../components/Content'
import { useCurrentLanguage } from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { CodeHashMessage, ScriptCells, ScriptTransactions } from './ScriptsComp'
import { usePaginationParamsInPage } from '../../hooks'
import { shannonToCkb } from '../../utils/util'
import Capacity from '../../components/Capacity'
import styles from './styles.module.scss'
import { type ScriptInfo, explorerService } from '../../services/ExplorerService'
import { ScriptTab, ScriptTabPane, ScriptTabTitle } from './styled'
import { Card, CardCellInfo, CardCellsLayout } from '../../components/Card'
import { ReactComponent as OpenSourceIcon } from '../../assets/open-source.svg'
import { HashType } from '../../constants/common'

const getScriptInfo = (scriptInfo: ScriptInfo, t: TFunction) => {
  const {
    name,
    dataHash,
    typeHash,
    hashType,
    depType,
    isLockScript,
    isTypeScript,
    capacityOfDeployedCells,
    capacityOfReferringCells,
    rfc,
    sourceUrl,
    website,
    deprecated,
    scriptOutPoint,
  } = scriptInfo
  const [outpointTxHash, outpointIndex] = scriptOutPoint.split('-')
  const parsedHashType = hashType === null ? 'Type' : hashType
  const scriptType = `${isTypeScript ? t('scripts.type_script') : ''} ${isLockScript ? t('scripts.lock_script') : ''}`
  const items: CardCellInfo<'left' | 'right'>[] = [
    {
      title: t('scripts.script_name'),
      tooltip: t('glossary.script_name'),
      content: name,
    },
    {
      slot: 'left',
      cell: {
        title: t('scripts.script_type'),
        content: scriptType,
      },
    },
    {
      title: t('scripts.code_hash'),
      content:
        parsedHashType === 'Type' ? <CodeHashMessage codeHash={typeHash} /> : <CodeHashMessage codeHash={dataHash} />,
    },
    {
      slot: 'right',
      cell: {
        title: t('scripts.hash_type'),
        tooltip: t('glossary.hash_type'),
        content: <span className={styles.hashType}>{parsedHashType}</span>,
      },
    },
    {
      slot: 'right',
      cell:
        parsedHashType === 'Type'
          ? {
              title: t('scripts.data_hash'),
              content: dataHash ? <CodeHashMessage codeHash={dataHash} /> : '-',
            }
          : {
              title: t('scripts.type_hash'),
              content: typeHash ? <CodeHashMessage codeHash={typeHash} /> : '-',
            },
    },
    {
      slot: 'left',
      cell: {
        title: t('scripts.outpoint_tx_hash'),
        content: outpointTxHash,
      },
    },
    {
      slot: 'left',
      cell: {
        title: t('scripts.outpoint_index'),
        content: outpointIndex,
      },
    },
    {
      slot: 'left',
      cell: {
        title: t('scripts.outpoint_dep_type'),
        content: depType,
      },
    },
    {
      title: t('scripts.capacity_of_deployed_cells'),
      tooltip: t('glossary.capacity_of_deployed_cells'),
      content: <Capacity capacity={shannonToCkb(capacityOfDeployedCells)} display="short" />,
    },
    {
      slot: 'right',
      cell: {
        title: t('scripts.capacity_of_referring_cells'),
        content: <Capacity capacity={shannonToCkb(capacityOfReferringCells)} display="short" />,
      },
    },
    {
      slot: 'left',
      cell: {
        title: t('scripts.status'),
        content: deprecated === true ? t('scripts.deprecated') : t('scripts.active'),
      },
    },
  ]

  if (rfc) {
    items.push({
      title: t('scripts.link.rfc'),
      content: <Link to={rfc}>{t('scripts.link.rfc')}</Link>,
    })
  }
  if (website) {
    items.push({
      title: t('scripts.link.website'),
      content: <Link to={website}>{t('scripts.link.website')}</Link>,
    })
  }
  if (sourceUrl) {
    items.push({
      title: t('scripts.link.code'),
      content: (
        <Link to={sourceUrl}>
          {t('scripts.open_source_script')}
          <OpenSourceIcon />
        </Link>
      ),
    })
  }

  return items
}

type ScriptTabType = 'transactions' | 'deployed_cells' | 'referring_cells' | undefined

export function ScriptInfosCard({ scriptInfos }: { scriptInfos: ScriptInfo[] }) {
  const { t } = useTranslation()
  return (
    <>
      {scriptInfos.map(scriptInfo => (
        <Card style={{ marginTop: 24 }} key={scriptInfo.scriptOutPoint}>
          <CardCellsLayout type="left-right" cells={getScriptInfo(scriptInfo, t)} />
        </Card>
      ))}
    </>
  )
}
export const ScriptPage = () => {
  const history = useHistory()
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const currentLanguage = useCurrentLanguage()

  const { codeHash, hashType, tab } = useParams<{
    codeHash: string
    hashType: HashType
    tab: ScriptTabType
  }>()
  const { currentPage, pageSize } = usePaginationParamsInPage()

  const [pageOfTransactions, setPageOfTransactions] = useState<number>(1)
  const [pageOfDeployedCells, setPageOfDeployedCells] = useState<number>(1)
  const [pageOfReferringCells, setPageOfReferringCells] = useState<number>(1)

  const { status, data: resp } = useQuery(['scripts_general_info', codeHash, hashType], () =>
    explorerService.api.fetchScriptInfo(codeHash, hashType),
  )

  const scriptInfos: ScriptInfo[] =
    status === 'success' && resp
      ? resp.data
      : [
          {
            name: '',
            dataHash: '',
            typeHash: '',
            depType: '',
            hashType: hashType as HashType,
            isTypeScript: false,
            isLockScript: false,
            capacityOfDeployedCells: '0',
            capacityOfReferringCells: '0',
            countOfTransactions: 0,
            countOfReferringCells: 0,
            rfc: '',
            website: '',
            sourceUrl: '',
            deprecated: false,
            scriptOutPoint: '',
          },
        ]

  const countOfDeployedCells = scriptInfos.length
  const countOfReferringCells = scriptInfos.reduce((sum, item) => sum + item.countOfReferringCells, 0)
  const countOfTransactions = scriptInfos.reduce((sum, item) => sum + item.countOfTransactions, 0)

  return (
    <Content>
      <div className={`${styles.scriptContentPanel} container`}>
        <ScriptInfosCard scriptInfos={scriptInfos} />
        <ScriptTab
          key={currentLanguage + countOfTransactions + countOfDeployedCells + countOfReferringCells}
          className={styles.scriptTabs}
          activeKey={tab ?? 'transactions'}
          animated={{ inkBar: false }}
          onTabClick={key => {
            const currentTab = tab ?? 'transactions'
            if (currentTab === key) return

            if (currentTab === 'deployed_cells') {
              setPageOfDeployedCells(currentPage)
            } else if (currentTab === 'referring_cells') {
              setPageOfReferringCells(currentPage)
            } else if (currentTab === 'transactions') {
              setPageOfTransactions(currentPage)
            }
            if (key === 'deployed_cells') {
              history.push(
                `/${language}/script/${codeHash}/${hashType}/deployed_cells?page=${pageOfDeployedCells}&size=${pageSize}`,
              )
            } else if (key === 'referring_cells') {
              history.push(
                `/${language}/script/${codeHash}/${hashType}/referring_cells?page=${pageOfReferringCells}&size=${pageSize}`,
              )
            } else if (key === 'transactions') {
              history.push(`/${language}/script/${codeHash}/${hashType}?page=${pageOfTransactions}&size=${pageSize}`)
            }
          }}
          renderTabBar={(props, DefaultTabBar) => {
            return (
              <Card rounded="top" className={styles.cardHeader}>
                <DefaultTabBar {...props} className={styles.tablist} />
              </Card>
            )
          }}
        >
          <ScriptTabPane tab={<ScriptTabTitle>{`${t('transaction.transactions')}`}</ScriptTabTitle>} key="transactions">
            <ScriptTransactions page={currentPage} size={pageSize} countOfTransactions={countOfTransactions} />
          </ScriptTabPane>
          <ScriptTabPane
            tab={
              <ScriptTabTitle>
                {`${t('scripts.deployed_cells')} (${localeNumberString(countOfDeployedCells)})`}
              </ScriptTabTitle>
            }
            key="deployed_cells"
          >
            <ScriptCells page={currentPage} size={pageSize} cellType="deployed_cells" />
          </ScriptTabPane>
          <ScriptTabPane
            tab={
              <ScriptTabTitle>
                {`${t('scripts.referring_cells')} (${localeNumberString(countOfReferringCells)})`}
              </ScriptTabTitle>
            }
            key="referring_cells"
          >
            <ScriptCells page={currentPage} size={100} cellType="referring_cells" />
          </ScriptTabPane>
        </ScriptTab>
      </div>
    </Content>
  )
}

export default ScriptPage
