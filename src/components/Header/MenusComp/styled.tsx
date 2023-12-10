import styled from 'styled-components'

export const MobileMenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 56px;
`

export const MobileMenuLink = styled.a`
  color: white;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: regular;
  margin-top: 22px;
  height: 21px;

  &:hover {
    font-weight: medium;
    color: ${props => props.theme.primary};
  }
`
export const HeaderMenuPanel = styled.div`
  display: flex;
  align-items: center;

  .headerMenusItem {
    color: white;
    display: flex;
    align-items: center;
    margin-right: 56px;
    font-size: 14px;
    font-weight: regular;

    @media (max-width: 1505px) and (min-width: 1025px) {
      margin-right: calc(56px - (1505px - 100vw) / 8);
    }

    @media (max-width: 1024px) {
      margin-right: 8px;
    }

    &:hover {
      font-weight: medium;
      color: ${props => props.theme.primary};
    }
  }
`
