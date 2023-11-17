import { FC, ReactElement, isValidElement, useMemo } from 'react'
import classNames from 'classnames'
import { CardCell, CardCellProps } from './CardCell'
import styles from './CardCellsLayout.module.scss'
import { useBoolean, useIsMobile } from '../../utils/hook'
import { ReactComponent as DownArrowIcon } from './down_arrow.svg'

type LayoutType = 'left-right' | 'leftSingle-right'
type LayoutSlot = 'left' | 'right'

type CardCellInfo$WithoutSlot = ReactElement<unknown> | CardCellProps
type CardCellInfo$WithSlot = { slot: LayoutSlot; cell: CardCellInfo$WithoutSlot }
export type CardCellInfo = CardCellInfo$WithSlot | CardCellInfo$WithoutSlot

function isCardCellInfoWithSlot(info: CardCellInfo): info is CardCellInfo$WithSlot {
  return typeof info === 'object' && info != null && 'slot' in info
}

function renderCell(info: CardCellInfo$WithoutSlot) {
  if (isValidElement<unknown>(info)) return info
  return <CardCell {...info} />
}

export const CardCellsLayout: FC<{
  type: LayoutType
  cells: CardCellInfo[]
  defaultDisplayCountInMobile?: number
}> = ({ type, cells, defaultDisplayCountInMobile = 10 }) => {
  const isMobile = useIsMobile()
  const showExpandCtl = isMobile && cells.length > defaultDisplayCountInMobile
  const [isExpanded, expandCtl] = useBoolean(false)
  const displayCount = isMobile && !isExpanded ? defaultDisplayCountInMobile : Infinity

  const { leftCells, rightCells } = useMemo(() => {
    const leftCells: CardCellInfo$WithoutSlot[] = []
    const rightCells: CardCellInfo$WithoutSlot[] = []

    let currentSlot: LayoutSlot | null = null
    for (const info of cells) {
      const infoWithSlot: CardCellInfo$WithSlot = isCardCellInfoWithSlot(info)
        ? info
        : { slot: getNextSlot(type, currentSlot), cell: info }

      const { slot, cell } = infoWithSlot
      const container = slot === 'left' ? leftCells : rightCells
      container.push(cell)
      currentSlot = slot
    }

    if (leftCells.length >= displayCount) {
      leftCells.splice(displayCount)
      rightCells.splice(0)
    } else if (leftCells.length + rightCells.length > displayCount) {
      rightCells.splice(displayCount - leftCells.length)
    }

    return { leftCells, rightCells }
  }, [cells, displayCount, type])

  return (
    <div className={styles.cardCellsLayout}>
      {type === 'left-right' ? (
        <div className={styles.left}>{leftCells.map(renderCell)}</div>
      ) : (
        <div className={styles.leftSingle}>{renderCell(leftCells[0])}</div>
      )}

      <div className={styles.right}>{rightCells.map(renderCell)}</div>

      {showExpandCtl && (
        <div className={styles.expand} onPointerDown={() => expandCtl.toggle()} role="button" tabIndex={0}>
          <DownArrowIcon className={classNames({ [styles.isExpanded ?? '']: isExpanded })} />
        </div>
      )}
    </div>
  )
}

function getNextSlot(layout: LayoutType, slot?: LayoutSlot | null): LayoutSlot {
  if (layout === 'leftSingle-right') return 'right'

  switch (slot) {
    case 'left':
      return 'right'
    case 'right':
      return 'left'
    default:
      return 'left'
  }
}
