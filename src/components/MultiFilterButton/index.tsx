import { Link } from 'react-router-dom'
import { Popover } from 'antd'
import { useTranslation } from 'react-i18next'
import { ReactComponent as FilterIcon } from '../../assets/filter_icon.svg'
import { ReactComponent as SelectedIcon } from '../../assets/selected-icon.svg'
import { ReactComponent as NotSelectedIcon } from '../../assets/not-selected-icon.svg'
import { ReactComponent as PartialSelectedIcon } from '../../assets/partial-selected-icon.svg'
import { useSearchParams } from '../../hooks'
import styles from './styles.module.scss'

export function MultiFilterButton({
  filteredList,
  isMobile,
  filterName,
}: {
  filterName: string
  filteredList: { key: string; value: string; to: string; title: string | JSX.Element }[]
  isMobile?: boolean
}) {
  const { t } = useTranslation()
  const params = useSearchParams(filterName)
  const filter = params[filterName]
  let types = filteredList.map(f => f.value)
  if (filter !== undefined) {
    types = filter.split(',').filter(t => t !== '')
  }

  return (
    <Popover
      className={styles.container}
      placement="bottomRight"
      trigger={isMobile ? 'click' : 'hover'}
      overlayClassName={styles.antPopover}
      content={
        <div className={styles.filterItems}>
          <div className={styles.selectTitle}>
            <h2>{t('components.multi_filter_button.select')}</h2>
            <Link
              key="all"
              to={() => {
                return types.length === 0 || types.length !== filteredList.length
                  ? filteredList[0].to
                  : `${filteredList[0].to}?${new URLSearchParams({ [filterName]: '' }).toString()}`
              }}
            >
              {types.length > 0 ? (
                <>{types.length === filteredList.length ? <SelectedIcon /> : <PartialSelectedIcon />}</>
              ) : (
                <NotSelectedIcon />
              )}
            </Link>
          </div>
          {filteredList.map(f => (
            <Link
              key={f.key}
              to={() => {
                let subTypes = types.map(t => t)
                if (subTypes.includes(f.value)) {
                  subTypes = subTypes.filter(t => t !== f.value)
                } else {
                  subTypes.push(f.value)
                }
                return `${f.to}?${new URLSearchParams({ [filterName]: subTypes.join(',') }).toString()}`
              }}
              data-is-active={types.includes(f.value)}
            >
              {f.title}
              {types.includes(f.value) ? <SelectedIcon /> : <NotSelectedIcon />}
            </Link>
          ))}
        </div>
      }
    >
      <FilterIcon className={styles.filter} />
    </Popover>
  )
}

MultiFilterButton.displayName = 'MultiFilterButton'

export default MultiFilterButton
