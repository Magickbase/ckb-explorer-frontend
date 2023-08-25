import { Link } from 'react-router-dom'
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import { Popover, Tooltip } from 'antd'
import classNames from 'classnames'
import SortButton from '../../components/SortButton'
import i18n from '../../utils/i18n'
import { handleNftImgError, patchMibaoImg } from '../../utils/util'
import { ReactComponent as SelectedCheckIcon } from '../../assets/selected_check_icon.svg'
import { ReactComponent as FilterIcon } from '../../assets/filter_icon.svg'
import { getPrimaryColor } from '../../constants/common'
import { useIsMobile, useSearchParams, useSortParam } from '../../utils/hook'
import styles from './styles.module.scss'

type NftSortField = 'transactions' | 'holder' | 'minted'
const primaryColor = getPrimaryColor()
const filterList: Array<Record<'title' | 'value', string>> = [
  {
    value: 'all',
    title: i18n.t('nft.all-type'),
  },
  {
    value: 'm_nft',
    title: i18n.t('nft.m_nft'),
  },
  {
    value: 'nrc721',
    title: i18n.t('nft.nrc_721'),
  },
  {
    value: 'cota',
    title: i18n.t('nft.cota'),
  },
  {
    value: 'spore',
    title: i18n.t('nft.spore'),
  },
]

export const isTxFilterType = (s?: string): boolean => {
  return s ? ['all', 'm_nft', 'nrc721', 'cota', 'spore'].includes(s) : false
}

export interface NFTCollection {
  id: number
  standard: string
  name: string
  description: string
  h24_ckb_transactions_count: string
  creator: string | null
  icon_url: string | null
  items_count: number | null
  holders_count: number | null
  type_script: { code_hash: string; hash_type: 'data' | 'type'; args: string } | null
}

const TypeFilter = () => {
  const isMobile = useIsMobile()
  const { type } = useSearchParams('type')
  const isActive = isTxFilterType(type)

  return (
    <div className={styles.typeFilter} data-is-active={isActive}>
      {i18n.t('nft.standard')}
      <Popover
        placement={isMobile ? 'bottomRight' : 'bottomLeft'}
        trigger={isMobile ? 'click' : 'hover'}
        overlayClassName={styles.antPopover}
        content={
          <div className={styles.filterItems}>
            {filterList.map(f => (
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

const HolderMinterSort = () => {
  const { sortBy, handleSortClick } = useSortParam<NftSortField>(
    s => s === 'transactions' || s === 'holder' || s === 'minted',
  )

  return (
    <div className={styles.holderMinted}>
      <div
        className={classNames({
          [styles.sortActive]: sortBy === 'holder',
        })}
        onClick={() => handleSortClick('holder')}
        aria-hidden
      >
        {i18n.t('nft.holder')}
      </div>
      &nbsp;/&nbsp;
      <div
        className={classNames({
          [styles.sortActive]: sortBy === 'minted',
        })}
        onClick={() => handleSortClick('minted')}
        aria-hidden
      >
        {i18n.t('nft.minted')}
      </div>
    </div>
  )
}

export const ListOnDesktop: React.FC<{ isLoading: boolean; list: Array<NFTCollection> }> = ({ list, isLoading }) => {
  return (
    <table data-role="desktop-list">
      <thead>
        <tr>
          <th>{i18n.t('nft.collection_name')}</th>
          <th>
            <TypeFilter />
          </th>
          <th className={styles.transactionsHeader}>
            <span>
              {i18n.t('nft.transactions')}
              <SortButton field="transactions" />
            </span>
          </th>
          <th>
            <HolderMinterSort />
          </th>
          <th>{i18n.t('nft.minter_address')}</th>
        </tr>
      </thead>
      <tbody>
        {list.length ? (
          list.map(item => {
            let typeHash: string | null = null
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
                      <img src="/images/nft_placeholder.png" alt="cover" loading="lazy" className={styles.icon} />
                    )}
                    <Link
                      to={`/nft-collections/${typeHash || item.id}`}
                      title={item.name}
                      style={{
                        color: primaryColor,
                      }}
                    >
                      {item.name}
                    </Link>
                  </div>
                </td>
                <td>{i18n.t(`nft.${item.standard}`)}</td>
                <td>{item.h24_ckb_transactions_count}</td>
                <td>{`${(item.holders_count ?? 0).toLocaleString('en')}/${(item.items_count ?? 0).toLocaleString(
                  'en',
                )}`}</td>
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
            <td colSpan={5} className={styles.noRecord}>
              {isLoading ? 'loading' : i18n.t(`nft.no_record`)}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export const ListOnMobile: React.FC<{ isLoading: boolean; list: Array<NFTCollection> }> = ({ list, isLoading }) => {
  return (
    <div data-role="mobile-list">
      <div className={styles.listHeader}>
        <TypeFilter />
        <HolderMinterSort />
      </div>
      <div>
        {list.length ? (
          list.map(item => {
            let typeHash: string | null = null
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
              <div key={item.id} className={styles.listItem}>
                <div>
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
                      <img src="/images/nft_placeholder.png" alt="cover" loading="lazy" className={styles.icon} />
                    )}
                    <Link
                      to={`/nft-collections/${typeHash || item.id}`}
                      title={item.name}
                      style={{
                        color: primaryColor,
                      }}
                    >
                      {item.name}
                    </Link>
                  </div>
                </div>
                <dl>
                  <dt>{i18n.t(`nft.standard`)}</dt>
                  <dd>{i18n.t(`nft.${item.standard}`)}</dd>
                </dl>
                <dl>
                  <dt>{`${i18n.t('nft.holder')}/${i18n.t('nft.minted')}`}</dt>
                  <dd>
                    {`${(item.holders_count ?? 0).toLocaleString('en')}/${(item.items_count ?? 0).toLocaleString(
                      'en',
                    )}`}
                  </dd>
                </dl>
                {item.creator ? (
                  <dl>
                    <dt>{i18n.t(`nft.minter_address`)}</dt>
                    <dd>
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
                    </dd>
                  </dl>
                ) : null}
              </div>
            )
          })
        ) : (
          <div className={styles.loading}>{isLoading ? 'loading' : i18n.t(`nft.no_record`)}</div>
        )}
      </div>
    </div>
  )
}
