import styled from 'styled-components'
import variables from '../../../styles/variables.module.scss'

export const TransactionCellListTitlePanel = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: ${variables.mobileBreakPoint}) {
    display: none;
  }

  .transactionCellListTitles {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    color: #000;

    > div {
      height: 24px;
    }

    > div:nth-child(1) {
      flex: 0.4;
    }

    > div:nth-child(2) {
      flex: 0.22;
      display: flex;
    }

    > div:nth-child(3) {
      flex: 0.3;
      display: flex;
      justify-content: flex-end;
    }

    > div:nth-child(4) {
      flex: 0.08;
      display: flex;
      justify-content: flex-end;
    }
  }

  &::after {
    content: '';
    background: #e2e2e2;
    height: 1px;
    margin-top: 20px;
    transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
  }
`

export const TransactionCellListPanel = styled.div`
  width: 100%;
  border-radius: 6px 6px 0 0;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #fff;
  padding: 12px 20px 12px 40px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    padding: 12px 10px 3px;
  }
`

export const TransactionCellsPanel = styled.div`
  .transactionCellTitle {
    color: #000;
    font-weight: 600;
    font-size: 20px;
    margin-left: 10px;

    @media (min-width: ${variables.mobileBreakPoint}) {
      display: none;
    }
  }
`
