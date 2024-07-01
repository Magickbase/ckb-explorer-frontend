import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import { Popover, Tooltip } from 'antd'
import classNames from 'classnames'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from '../../components/Link'
import SortButton from '../../components/SortButton'
import { handleNftImgError, patchMibaoImg } from '../../utils/util'
import { ReactComponent as SelectedCheckIcon } from '../../assets/selected_check_icon.svg'
import { ReactComponent as FilterIcon } from './filter.svg'
import { getPrimaryColor } from '../../constants/common'
import { useIsMobile, useSearchParams } from '../../hooks'
import styles from './styles.module.scss'
import type { NFTCollection } from '../../services/ExplorerService/fetcher'
import { useNFTCollectionsSortParam } from './util'
import { parseSimpleDate } from '../../utils/date'
import MultiFilterButton from '../../components/MultiFilterButton'
import XUDTTag from '../../components/XUDTTag'
import { Card } from '../../components/Card'
import { FilterSortContainerOnMobile } from '../../components/FilterSortContainer'

const primaryColor = getPrimaryColor()
function useFilterList(): Record<'title' | 'value', string>[] {
  const { t } = useTranslation()
  return [
    {
      value: 'all',
      title: t('nft.all-type'),
    },
    {
      value: 'm_nft',
      title: t('nft.m_nft'),
    },
    {
      value: 'nrc721',
      title: t('nft.nrc_721'),
    },
    {
      value: 'cota',
      title: t('nft.cota'),
    },
    {
      value: 'spore',
      title: t('nft.dobs'),
    },
  ]
}

const filterList = [
  {
    key: 'invalid',
    value: 'invalid',
    title: <XUDTTag tagName="invalid" />,
    to: '/nft-collections',
  },
  {
    key: 'suspicious',
    value: 'suspicious',
    title: <XUDTTag tagName="suspicious" />,
    to: '/nft-collections',
  },
  {
    key: 'out-of-length-range',
    value: 'out-of-length-range',
    title: <XUDTTag tagName="out-of-length-range" />,
    to: '/nft-collections',
  },
  {
    key: 'duplicate',
    value: 'duplicate',
    title: <XUDTTag tagName="duplicate" />,
    to: '/nft-collections',
  },
  {
    key: 'layer-1-asset',
    value: 'layer-1-asset',
    title: <XUDTTag tagName="layer-1-asset" />,
    to: '/nft-collections',
  },
  {
    key: 'layer-2-asset',
    value: 'layer-2-asset',
    title: <XUDTTag tagName="layer-2-asset" />,
    to: '/nft-collections',
  },
  {
    key: 'verified-on',
    value: 'verified-on',
    title: <XUDTTag tagName="verified-on" />,
    to: '/nft-collections',
  },
  {
    key: 'supply-limited',
    value: 'supply-limited',
    title: <XUDTTag tagName="supply-limited" />,
    to: '/nft-collections',
  },
  {
    key: 'supply-unlimited',
    value: 'supply-unlimited',
    title: <XUDTTag tagName="supply-unlimited" />,
    to: '/nft-collections',
  },
  {
    key: 'rgbpp-compatible',
    value: 'rgbpp-compatible',
    title: <XUDTTag tagName="rgbpp-compatible" />,
    to: '/nft-collections',
  },
  {
    key: 'category',
    value: 'category',
    title: <XUDTTag tagName="category" />,
    to: '/nft-collections',
  },
]

export const isTxFilterType = (s?: string): boolean => {
  return s ? ['all', 'm_nft', 'nrc721', 'cota', 'spore'].includes(s) : false
}

const TypeFilter = () => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const { type } = useSearchParams('type')
  const isActive = isTxFilterType(type)
  const list = useFilterList()
  return (
    <div className={styles.typeFilter} data-is-active={isActive}>
      {t('nft.standard')}
      <Popover
        placement={isMobile ? 'bottomRight' : 'bottomLeft'}
        trigger={isMobile ? 'click' : 'hover'}
        overlayClassName={styles.antPopover}
        content={
          <div className={styles.filterItems}>
            {list.map(f => (
              <Link
                key={f.value}
                to={`/nft-collections?${new URLSearchParams({ type: f.value })}`}
                data-is-active={f.value === type}
              >
                {f.title}
                <SelectedCheckIcon />
              </Link>
            ))}
          </div>
        }
      >
        <FilterIcon className={styles.filter} />
      </Popover>
    </div>
  )
}

const Tags = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.colTags}>
      {t('xudt.title.tags')}
      <MultiFilterButton filterName="tags" key="" filteredList={filterList} />
    </div>
  )
}

const HolderMinterSort = () => {
  const { t } = useTranslation()
  const sortParam = useNFTCollectionsSortParam()
  const { sortBy, handleSortClick } = sortParam

  return (
    <div className={styles.holderMinted}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className={classNames({
          [styles.sortActive]: sortBy === 'holder',
        })}
        onClick={() => handleSortClick('holder')}
        role="button"
        tabIndex={0}
      >
        {t('nft.holder')}
        {sortBy === 'holder' && <SortButton field="holder" sortParam={sortParam} />}
      </div>
      <span className={styles.divider}>/</span>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className={classNames({
          [styles.sortActive]: sortBy === 'minted',
        })}
        onClick={() => handleSortClick('minted')}
        role="button"
        tabIndex={0}
      >
        {t('nft.minted')}
        {sortBy !== 'holder' && <SortButton field="minted" sortParam={sortParam} />}
      </div>
    </div>
  )
}
interface SimpleSortProps {
  sortField: 'transactions' | 'timestamp'
  fieldI18n: string
}
const SimpleSortHeader: React.FC<SimpleSortProps> = ({ sortField, fieldI18n }) => {
  const sortParam = useNFTCollectionsSortParam()
  const { handleSortClick } = sortParam
  return (
    <span>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <span onClick={() => handleSortClick(sortField)} role="button" tabIndex={0}>
        {fieldI18n}
      </span>
      <SortButton field={sortField} sortParam={sortParam} />
    </span>
  )
}

const TypeInfo: React.FC<{ nft: NFTCollection }> = ({ nft: item }) => {
  const { t } = useTranslation()
  return t(`glossary.${item.standard}`) ? (
    <Tooltip
      placement="top"
      overlayClassName={styles.nftTooltip}
      title={
        <Trans
          i18nKey={`glossary.${item.standard}`}
          components={{
            cota_link: (
              // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
              <a
                href="https://talk.nervos.org/t/rfc-cota-a-compact-token-aggregator-standard-for-extremely-low-cost-nfts-and-fts/6338"
                target="_blank"
                rel="noreferrer"
              />
            ),
            m_nft_link: (
              // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
              <a href="https://github.com/nervina-labs/ckb-nft-scripts" target="_blank" rel="noreferrer" />
            ),
          }}
        />
      }
    >
      {t(`nft.${item.standard === 'spore' ? 'dobs' : item.standard}`)}
    </Tooltip>
  ) : (
    t(`nft.${item.standard}`)
  )
}

export const ListOnDesktop: React.FC<{ isLoading: boolean; list: NFTCollection[] }> = ({ list, isLoading }) => {
  const { t } = useTranslation()

  return (
    <table data-role="desktop-list">
      <thead>
        <tr>
          <th>{t('nft.collection_name')}</th>
          <th>
            <Tags />
          </th>
          <th>
            <TypeFilter />
          </th>
          <th className={styles.transactionsHeader}>
            <SimpleSortHeader sortField="transactions" fieldI18n={t('nft.transactions')} />
          </th>
          <th>
            <HolderMinterSort />
          </th>
          <th>
            <SimpleSortHeader sortField="timestamp" fieldI18n={t('nft.created_time')} />
          </th>
          <th>{t('nft.minter_address')}</th>
        </tr>
      </thead>
      <tbody>
        {list.length ? (
          list.map(item => {
            let typeHash: string | null = null
            const itemName: string = item.standard === 'spore' && item.creator === '' ? 'Unique items' : item.name
            try {
              if (item.type_script) {
                typeHash = scriptToHash({
                  codeHash: item.type_script.code_hash,
                  hashType: item.type_script.hash_type,
                  args: item.type_script.args,
                })
              }
            } catch {
              typeHash = item.sn
            }
            return (
              <tr key={item.id}>
                <td>
                  <div className={styles.name}>
                    {item.icon_url ? (
                      <img
                        src={`${patchMibaoImg(item.icon_url)}?size=small`}
                        alt="cover"
                        loading="lazy"
                        className={styles.icon}
                        onError={handleNftImgError}
                      />
                    ) : (
                      <img
                        src={
                          item.standard === 'spore' ? '/images/spore_placeholder.svg' : '/images/nft_placeholder.png'
                        }
                        alt="cover"
                        loading="lazy"
                        className={styles.icon}
                      />
                    )}
                    <Link
                      to={`/nft-collections/${typeHash || item.id}`}
                      title={itemName}
                      style={{
                        color: primaryColor,
                      }}
                    >
                      {itemName}
                    </Link>
                  </div>
                </td>
                <td>
                  <div className={styles.tags}>
                    {item.tags.map(tag => (
                      <XUDTTag tagName={tag} />
                    ))}
                  </div>
                </td>
                <td>
                  <TypeInfo nft={item} />
                </td>
                <td>{item.h24_ckb_transactions_count}</td>
                <td>{`${(item.holders_count ?? 0).toLocaleString('en')}/${(item.items_count ?? 0).toLocaleString(
                  'en',
                )}`}</td>
                <td>{item.timestamp === null ? '' : parseSimpleDate(item.timestamp)}</td>
                <td>
                  <div>
                    {item.creator ? (
                      <Tooltip title={item.creator}>
                        <Link
                          to={`/address/${item.creator}`}
                          className="monospace"
                          style={{
                            color: primaryColor,
                            fontWeight: 700,
                          }}
                        >{`${item.creator.slice(0, 8)}...${item.creator.slice(-8)}`}</Link>
                      </Tooltip>
                    ) : (
                      '-'
                    )}
                  </div>
                </td>
              </tr>
            )
          })
        ) : (
          <tr>
            <td colSpan={6} className={styles.noRecord}>
              {isLoading ? 'loading' : t(`nft.no_record`)}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export const ListOnMobile: React.FC<{ isLoading: boolean; list: NFTCollection[] }> = ({ list, isLoading }) => {
  const { t } = useTranslation()

  return (
    <>
      <Card className={styles.filterSortCard} shadow={false}>
        <FilterSortContainerOnMobile>
          <TypeFilter />
          <SimpleSortHeader sortField="transactions" fieldI18n={t('nft.transactions')} />
          <HolderMinterSort />
          <SimpleSortHeader sortField="timestamp" fieldI18n={t('nft.created_time')} />
          <div>
            {t('xudt.title.tags')}
            <MultiFilterButton filterName="tags" key="" filteredList={filterList} />
          </div>
        </FilterSortContainerOnMobile>
      </Card>
      <div>
        {list.length ? (
          list.map(item => {
            let typeHash: string | null = null
            const itemName: string = item.standard === 'spore' && item.creator === '' ? 'Unique items' : item.name
            try {
              if (item.type_script) {
                typeHash = scriptToHash({
                  codeHash: item.type_script.code_hash,
                  hashType: item.type_script.hash_type,
                  args: item.type_script.args,
                })
              }
            } catch {
              // ignore
            }
            return (
              <Card key={item.id} className={styles.tokensCard}>
                <div>
                  <dl className={styles.tokenInfo}>
                    <dt className={styles.title}>Name</dt>
                    <dd>
                      {item.icon_url ? (
                        <img
                          src={`${patchMibaoImg(item.icon_url)}?size=small`}
                          alt="cover"
                          loading="lazy"
                          className={styles.icon}
                          onError={handleNftImgError}
                        />
                      ) : (
                        <img
                          src={
                            item.standard === 'spore' ? '/images/spore_placeholder.svg' : '/images/nft_placeholder.png'
                          }
                          alt="cover"
                          loading="lazy"
                          className={styles.icon}
                        />
                      )}
                      <Link to={`/nft-collections/${typeHash || item.id}`} title={itemName} className={styles.link}>
                        {itemName}
                      </Link>
                    </dd>
                  </dl>
                  <div className={styles.name} />
                </div>
                <dl className={styles.tokenInfo}>
                  <dt className={styles.title}>{t(`nft.standard`)}</dt>
                  <dd className={styles.value}>
                    <TypeInfo nft={item} />
                  </dd>
                </dl>

                <dl className={styles.tokenInfo}>
                  <dt>{`${t('nft.holder')}/${t('nft.minted')}`}</dt>
                  <dd>
                    {`${(item.holders_count ?? 0).toLocaleString('en')}/${(item.items_count ?? 0).toLocaleString(
                      'en',
                    )}`}
                  </dd>
                </dl>
                <dl className={styles.tokenInfo}>
                  <dt>{t('nft.transactions')}</dt>
                  <dd>{item.h24_ckb_transactions_count}</dd>
                </dl>
                <dl className={styles.tokenInfo}>
                  <dt>{t('nft.created_time')}</dt>
                  <dd>{item.timestamp === null ? '' : parseSimpleDate(item.timestamp)}</dd>
                </dl>
                {item.creator ? (
                  <dl className={styles.tokenInfo}>
                    <dt>{t(`nft.minter_address`)}</dt>
                    <dd>
                      <Tooltip title={item.creator}>
                        <Link
                          to={`/address/${item.creator}`}
                          className="monospace"
                          style={{
                            color: primaryColor,
                            fontWeight: 500,
                          }}
                        >{`${item.creator.slice(0, 8)}...${item.creator.slice(-8)}`}</Link>
                      </Tooltip>
                    </dd>
                  </dl>
                ) : null}
                <dl className={styles.tokenInfo} style={{ flexDirection: 'row' }}>
                  {item.tags.map(tag => (
                    <XUDTTag tagName={tag} />
                  ))}
                </dl>
              </Card>
            )
          })
        ) : (
          <div className={styles.loading}>{isLoading ? 'loading' : t(`nft.no_record`)}</div>
        )}
      </div>
    </>
  )
}
