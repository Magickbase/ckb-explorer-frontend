import styled from 'styled-components'

export const BlockListPanel = styled.div`
  @media (width >= 750px) {
    margin-top: 25px;
    margin-bottom: 40px;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 6px 0 rgb(77 77 77 / 21%);
  }

  @media (width <= 750px) {
    margin-top: 0;
    padding: 0 20px;

    .block__green__background {
      margin-left: -20px;
      height: 61px;
      width: calc(100% + 40px);
      z-index: 1;
    }
  }

  .block_list__pagination {
    @media (width <= 750px) {
      margin-top: 5px;
    }
  }
`

export const ContentTitle = styled.div`
  font-size: 50px;
  color: black;
  margin: 0 auto;
  text-align: center;

  @media (width <= 750px) {
    font-size: 26px;
  }

  &::after {
    content: '';
    background: ${props => props.theme.primary};
    height: 4px;
    width: 197px;
    display: block;
    margin: 0 auto;

    @media (width <= 750px) {
      width: 80px;
    }
  }
`

export const ContentTable = styled.div`
  @media (width <= 750px) {
    margin-top: -41px;
    z-index: 2;
  }
`

export const HighLightValue = styled.div`
  color: ${props => props.theme.primary};
  font-size: 13px;
  height: 16px;
  min-width: 0;
`

export const BlockRewardContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (width <= 750px) {
    align-items: flex-end;
    justify-content: flex-start;
  }

  ::after {
    display: inline;
    content: '+';
    color: #7f7d7d;
    font-size: 13px;
  }
`

export const BlockRewardPanel = styled.div`
  margin-right: 8px;
  display: flex;
  justify-content: center;
`
