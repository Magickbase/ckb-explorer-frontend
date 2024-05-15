/* eslint-disable react/destructuring-assignment */
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { ComponentProps, FC, useEffect, useState } from 'react'
import { SearchResultType, AggregateSearchResult } from '../../services/ExplorerService'
import { getURLByAggregateSearchResult, getDisplayNameByAggregateSearchResult } from './utils'
import { handleNftImgError, patchMibaoImg } from '../../utils/util'
import styles from './AggregateSearchResults.module.scss'
import EllipsisMiddle from '../EllipsisMiddle'
import SmallLoading from '../Loading/SmallLoading'
import { Link } from '../Link'

type Props = {
  keyword?: string
  loading?: boolean
  results: AggregateSearchResult[]
}

export const AggregateSearchResults: FC<Props> = ({ keyword = '', results, loading }) => {
  const { t } = useTranslation()
  const [activatedCategory, setActivatedCategory] = useState<{ [key in SearchResultType]?: boolean }>({})

  useEffect(() => {
    setActivatedCategory({})
  }, [results])

  const categories = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<SearchResultType, AggregateSearchResult[]>)

  const SearchResultCategoryPanel = (() => {
    return (
      <div className={styles.searchResultCategory}>
        {Object.entries(categories)
          .filter(([type]) =>
            // eslint-disable-next-line unused-imports/no-unused-vars
            Object.entries(activatedCategory).filter(([_, v]) => v).length === 0
              ? true
              : activatedCategory[type as SearchResultType],
          )
          .map(([type, items]) => (
            <div key={type} className={styles.category}>
              <div className={styles.categoryTitle}>{t(`search.${type}`)}</div>
              <div className={styles.categoryList}>
                {items.map(item => (
                  <SearchResultItem keyword={keyword} key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
      </div>
    )
  })()

  return (
    <div className={styles.searchResultsPanelWrapper}>
      {!loading && Object.keys(categories).length > 0 && (
        <div className={styles.searchCategoryFilter}>
          {(Object.keys(categories) as SearchResultType[]).map(category => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
              className={classNames(styles.searchCategoryTag, { [styles.active]: activatedCategory[category] })}
              onClick={() =>
                setActivatedCategory(pre => ({
                  ...pre,
                  [category]: pre[category] === undefined ? true : !pre[category],
                }))
              }
            >
              {t(`search.${category}`)} {`(${categories[category].length})`}
            </div>
          ))}
        </div>
      )}
      {/* eslint-disable-next-line no-nested-ternary */}
      {loading ? (
        <SmallLoading className={styles.loadingWrapper} />
      ) : results.length === 0 ? (
        <div className={styles.empty}>{t('search.no_search_result')}</div>
      ) : (
        SearchResultCategoryPanel
      )}
    </div>
  )
}

const SearchResultItem: FC<{ keyword?: string; item: AggregateSearchResult }> = ({ item, keyword = '' }) => {
  const { t } = useTranslation()
  const displayName = getDisplayNameByAggregateSearchResult(item)?.toString()
  const to = getURLByAggregateSearchResult(item)
  if (!to) return null

  if (item.type === SearchResultType.UDT) {
    return (
      <Link className={styles.searchResult} to={to}>
        <div className={styles.boxContent}>
          {!displayName ? t('udt.unknown_token') : <HighlightText text={displayName} keyword={keyword} />}
          <div className={classNames(styles.secondaryText, styles.subTitle, 'monospace')}>
            <span style={{ marginRight: 4, flexShrink: 0 }}>type hash:</span>
            <EllipsisMiddle
              style={{ maxWidth: '100%' }}
              useTextWidthForPlaceholderWidth
              title={item.attributes.typeHash}
            >
              {item.attributes.typeHash}
            </EllipsisMiddle>
          </div>
        </div>
      </Link>
    )
  }

  if (item.type === SearchResultType.TokenCollection) {
    return (
      <Link className={styles.searchResult} to={to}>
        <div className={styles.content}>
          {!displayName ? (
            t('udt.unknown_token')
          ) : (
            <>
              {item.attributes.iconUrl ? (
                <img
                  src={`${patchMibaoImg(item.attributes.iconUrl)}?size=small`}
                  alt="cover"
                  loading="lazy"
                  className={styles.icon}
                  onError={handleNftImgError}
                />
              ) : (
                <img
                  src={
                    item.attributes.standard === 'spore'
                      ? '/images/spore_placeholder.svg'
                      : '/images/nft_placeholder.png'
                  }
                  alt="cover"
                  loading="lazy"
                  className={styles.icon}
                />
              )}
              <HighlightText text={displayName} keyword={keyword} maxHighlightLength={16} sideCharLength={8} />
            </>
          )}
        </div>
      </Link>
    )
  }

  if (item.type === SearchResultType.DID) {
    return (
      <Link className={styles.searchResult} to={to}>
        <div className={styles.content}>
          <EllipsisMiddle
            style={{ maxWidth: 'min(200px, 60%)' }}
            useTextWidthForPlaceholderWidth
            title={item.attributes.did}
          >
            {item.attributes.did}
          </EllipsisMiddle>
          <EllipsisMiddle
            className={classNames(styles.secondaryText, 'monospace')}
            style={{ maxWidth: 'min(200px, 40%)' }}
            useTextWidthForPlaceholderWidth
            title={item.attributes.address}
          >
            {item.attributes.address}
          </EllipsisMiddle>
        </div>
      </Link>
    )
  }

  return (
    <Link className={styles.searchResult} to={to}>
      <div className={styles.content}>
        {!displayName ? (
          t('udt.unknown_token')
        ) : (
          <HighlightText text={displayName} keyword={keyword} maxHighlightLength={16} sideCharLength={8} />
        )}
      </div>
    </Link>
  )
}

interface HighlightTextProps extends ComponentProps<'span'> {
  text: string
  keyword: string
  maxHighlightLength?: number
  sideCharLength?: number
}

const HighlightText: FC<HighlightTextProps> = ({
  text,
  keyword,
  maxHighlightLength = 5,
  sideCharLength = 3,
  ...props
}) => {
  const keywordIndex = text.toUpperCase().indexOf(keyword.toUpperCase())
  if (keywordIndex === -1)
    return (
      <EllipsisMiddle style={{ width: '100%' }} {...props}>
        {text}
      </EllipsisMiddle>
    )
  const startIndex = Math.max(0, keywordIndex - 1)
  const keywordLength = Math.min(keyword.length, maxHighlightLength)
  const preLength = startIndex
  const afterLength = text.length - (keywordLength + 1 + keywordIndex)
  const sideChar = sideCharLength

  return (
    <span className={styles.highlightText} {...props}>
      <span>
        {text.slice(0, preLength > sideChar ? sideChar : startIndex)}
        {preLength > sideChar ? '...' : ''}
      </span>
      <span style={{ textOverflow: 'clip' }}>
        {text.slice(startIndex, keywordIndex)}
        <span className={styles.highlight}>{text.slice(keywordIndex, keywordIndex + keywordLength)}</span>
        {text.slice(keywordIndex + keywordLength, keywordIndex + keywordLength + 1)}
      </span>
      <span>
        {afterLength > sideChar ? '...' : ''}
        {text.slice(afterLength > sideChar ? -sideChar : keywordIndex + keywordLength + 1)}
      </span>
    </span>
  )
}
