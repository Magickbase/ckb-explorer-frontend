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
  const { push, location } = useHistory()
  const { pathname } = useLocation()
  const query = new URLSearchParams(location.search)
  const sort = query.get('sort')
  const [sortKey, sortOrder] = sort?.split('.') ?? []

  const isActive = sortKey === field

  const handleClick = () => {
    if (sortKey === field) {
      push(
        `${pathname}?${new URLSearchParams({
          ...Object.fromEntries(query),
          sort: sortOrder === SortOrder.Asc ? `${field}.${SortOrder.Desc}` : `${field}.${SortOrder.Asc}`,
        })}`,
      )
      return
    }
    push(
      `${pathname}?${new URLSearchParams({
        ...Object.fromEntries(query),
        sort: `${field}.${SortOrder.Desc}`,
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
