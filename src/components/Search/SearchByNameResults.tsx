/* eslint-disable react/destructuring-assignment */
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { FC } from 'react'
import { UDTQueryResult } from '../../services/ExplorerService/fetcher'
import styles from './SearchByNameResults.module.scss'
import EllipsisMiddle from '../EllipsisMiddle'
import SmallLoading from '../Loading/SmallLoading'

type Props = {
  keyword?: string
  loading?: boolean
  udtQueryResults: UDTQueryResult[]
}

export const SearchByNameResults: FC<Props> = ({ keyword = '', udtQueryResults, loading }) => {
  const { t } = useTranslation()

  return (
    <div className={styles.searchResultsPanelWrapper}>
      {/* eslint-disable-next-line no-nested-ternary */}
      {loading ? (
        <SmallLoading className={styles.loadingWrapper} />
      ) : udtQueryResults.length === 0 ? (
        <div className={styles.empty}>{t('search.no_search_result')}</div>
      ) : (
        udtQueryResults.map(item => <SearchByNameResult keyword={keyword} key={item.typeHash} item={item} />)
      )}
    </div>
  )
}

const SearchByNameResult: FC<{ keyword?: string; item: UDTQueryResult }> = ({ item, keyword = '' }) => {
  const { t } = useTranslation()
  const { typeHash, fullName, symbol, udtType } = item
  const displayName = symbol ?? fullName

  const HighlightText = (text: string, keyword: string) => {
    const keywordIndex = text.toUpperCase().indexOf(keyword.toUpperCase())
    if (keywordIndex === -1) return text
    return (
      <span className={styles.highlightText} style={{ maxWidth: 'min(200px, 60%)' }}>
        <span className={styles.ellipsisText}>{text.slice(0, keywordIndex - 1)}</span>
        <span style={{ textOverflow: 'clip' }}>
          {text.slice(keywordIndex - 1, keywordIndex)}
          <span className={styles.highlight}>{text.slice(keywordIndex, keywordIndex + keyword.length)}</span>
          {text.slice(keywordIndex + keyword.length, keywordIndex + keyword.length + 1)}
        </span>
        <span className={styles.ellipsisText} style={{ direction: 'rtl' }}>
          {text.slice(keywordIndex + keyword.length + 1)}
        </span>
      </span>
    )
  }

  return (
    <a
      className={styles.searchResult}
      href={`${window.origin}/${udtType === 'omiga_inscription' ? 'inscription' : 'sudt'}/${typeHash}`}
    >
      <div className={styles.content}>
        {!displayName ? t('udt.unknown_token') : HighlightText(displayName, keyword)}
        <EllipsisMiddle
          className={classNames(styles.typeHash, 'monospace')}
          style={{ maxWidth: 'min(200px, 60%)' }}
          useTextWidthForPlaceholderWidth
          title={typeHash}
        >
          {typeHash}
        </EllipsisMiddle>
      </div>
    </a>
  )
}
