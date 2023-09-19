import styled from 'styled-components'

export const HalvingTitle = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 16px;
`

export const StrongText = styled.span`
  font-weight: bold;
`

export const Container = styled.div`
  margin-top: 32px;
  margin-bottom: 64px;
`

export const Paragraph = styled.p``

export const Blockquote = styled.blockquote`
  padding: 0 16px;
  border-left: 2px solid rgba(160, 160, 160);
  color: rgba(85, 85, 85);
`

export const Code = styled.code`
  background-color: rgb(246, 247, 248);
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`

export const Panel = styled.div`
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 6px 0 rgba(77, 77, 77, 0.2);
  padding: 16px 16px 32px 16px;
`
export const Img = styled.img`
  max-width: 100%;
`

export const HalvingPanel = styled.div`
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 6px 0 rgba(77, 77, 77, 0.2);
  padding: 16px 16px 32px 16px;
  gap: 16px;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
`

export const HalvingPanelTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
`

export const HalvingCountdown = styled.div`
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  display: flex;
  gap: 16px;

  @media (max-width: 1440px) {
  }

  @media (max-width: 1200px) {
    flex-direction: row;
  }

  @media (max-width: 750px) {
    flex-direction: column;
  }
`
export const HalvingCountdownItem = styled.div`
  border-radius: 6px;
  box-shadow: 0 2px 6px 0 rgba(77, 77, 77, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-width: 100px;
  height: 100px;
  overflow: hidden;
`

export const HalvingCountdownName = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 32px;
`

export const HalvingCountdownValue = styled.div`
  background: ${props => props.theme.primary};
  color: white;
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24px;
`

export const HalvingLogo = styled.img`
  height: 100px;
`

export const HalvingDescription = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const HalvingDocuments = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const EpochInfo = styled.div`
  height: 44px;
  display: flex;
  justify-content: space-between;
`

export const EpochInfoItem = styled.div`
  display: flex;
  flex-direction: column;
`

export const Separate = styled.div`
  height: 90%;
  background: rgb(234, 234, 234);
  width: 1px;
`

export const Secondary = styled.span`
  font-size: 12px;
  color: rgb(85, 85, 85);
`
