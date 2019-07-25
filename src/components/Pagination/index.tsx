import React, { useState } from 'react'
import { PaginationLeftItem, PaginationRightItem, PaginationPanel } from './styled'
import LeftBlack from '../../assets/pagination_black_left.png'
import RightBlack from '../../assets/pagination_black_right.png'
import i18n from '../../utils/i18n'

const PageFirstItem = ({
  currentPage,
  total,
  pageSize,
  defautJumpPage,
  onChange,
}: {
  currentPage: number
  total: number
  pageSize: number
  defautJumpPage: string
  onChange: (page: number, pageSize: number) => void
}) => {
  const [inputValue, setInputValue] = useState(defautJumpPage || '')
  const totalPage = Math.ceil(total / pageSize)
  const goFirstPage = () => {
    const page: number = 1
    onChange(page, pageSize)
  }

  const goLastPage = () => {
    onChange(totalPage, pageSize)
  }

  const goPrev = () => {
    if (currentPage > 1) {
      onChange(currentPage - 1, pageSize)
    }
  }

  const goNext = () => {
    if (currentPage < totalPage) {
      onChange(currentPage + 1, pageSize)
    }
  }

  const jumpPage = () => {
    const inputValueNumber = Number(inputValue)
    if (!Number.isNaN(inputValueNumber) && inputValueNumber <= totalPage && inputValueNumber >= 1) {
      onChange(inputValueNumber, pageSize)
    }
  }

  const isFirstPage = () => {
    return currentPage === 1
  }

  const isLastPage = () => {
    return currentPage === totalPage
  }

  return (
    <PaginationPanel>
      <PaginationLeftItem isFirstPage={isFirstPage()} isLastPage={isLastPage()}>
        <button type="button" className="first" onClick={() => goFirstPage()}>
          {i18n.t('pagination.first')}
        </button>
        <button type="button" className="leftimage" onClick={() => goPrev()}>
          <img src={LeftBlack} alt="left" />
        </button>
        <div className="middlelabel">{`Page ${currentPage} of ${totalPage}`}</div>
        <button type="button" className="rightimage" onClick={() => goNext()}>
          <img src={RightBlack} alt="right" />
        </button>
        <button type="button" className="last" onClick={() => goLastPage()}>
          {i18n.t('pagination.last')}
        </button>
      </PaginationLeftItem>
      <PaginationRightItem>
        <div className="page">{i18n.t('pagination.page')}</div>
        <input
          type="number"
          className="jumppageinput"
          value={inputValue}
          onChange={(event: any) => {
            if (event.target.value > 0 && event.target.value < totalPage) {
              setInputValue(event.target.value)
            } else if (event.target.value >= totalPage) {
              let { value } = event.target
              value = totalPage
              setInputValue(value)
            }
          }}
          onKeyUp={(event: any) => {
            if (event.keyCode === 13) {
              jumpPage()
            }
          }}
        />
        <button type="button" className="goto" onClick={() => jumpPage()}>
          {i18n.t('pagination.goto')}
        </button>
      </PaginationRightItem>
    </PaginationPanel>
  )
}

export default ({
  currentPage,
  total,
  pageSize,
  onChange,
}: {
  currentPage: number
  total: number
  pageSize: number
  onChange: (page: number, pageSize: number) => void
}) => {
  return (
    <PageFirstItem currentPage={currentPage} total={total} pageSize={pageSize} defautJumpPage="1" onChange={onChange} />
  )
}
