import { useHistory, useLocation } from 'react-router-dom'
import { ReactComponent as SortIcon } from '../../assets/sort_icon.svg'
import styles from './styles.module.scss'

enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

const SortButton: React.FC<{
  field: string
}> = ({ field }) => {
  const { push } = useHistory()
  const { search, pathname } = useLocation()

  const query = new URLSearchParams(search)

  const [sortKey, sortOrder] = query.get('sort')?.split('.') ?? []

  const isActive = sortKey === field

  const handleClick = () => {
    const shouldAsc = isActive && sortOrder === SortOrder.Desc
    push(
      `${pathname}?${new URLSearchParams({
        ...Object.fromEntries(query),
        sort: shouldAsc ? `${field}.${SortOrder.Asc}` : `${field}.${SortOrder.Desc}`,
      })}`,
    )
  }

  return (
    <button
      type="button"
      className={styles.container}
      data-is-asc={isActive && sortOrder === SortOrder.Asc}
      data-is-desc={isActive && sortOrder === SortOrder.Desc}
      onClick={handleClick}
    >
      <SortIcon />
    </button>
  )
}

SortButton.displayName = 'SortButton'

export default SortButton
