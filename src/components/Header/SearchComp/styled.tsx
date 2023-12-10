import styled from 'styled-components'
import variables from '../../../styles/variables.module.scss'

export const HeaderSearchPanel = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  height: 38px;
  width: 440px;

  @media (max-width: 1200px) {
    height: 38px;
    width: 100%;
  }

  @media (max-width: 1600px) {
    width: 360px;
    margin-right: 16px;
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin: 40px 56px;
  }
`

export const HeaderSearchBarPanel = styled.div`
  display: flex;
  align-items: center;

  > img {
    width: 18px;
    height: 18px;
  }
`
