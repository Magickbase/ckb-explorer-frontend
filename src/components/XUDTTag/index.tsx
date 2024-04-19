import { CSSProperties } from 'react'
import classNames from 'classnames'
import styles from './styles.module.scss'

const getTag = (tag: string) => {
  switch (tag) {
    case 'out-of-length-range':
      return <OutOfLengthRangeXUDTTag />
    case 'invalid':
      return <InvalidXUDTTag />
    case 'duplicate':
      return <DuplicateXUDTTag />
    case 'layer-1-asset':
      return <Layer1AssetXUDTTag />
    case 'layer-2-asset':
      return <Layer2AssetXUDTTag />
    case 'verified-on-platform':
      return <VerifiedOnPlatformXUDTTag />
    case 'supply-limited':
      return <SupplyLimitedXUDTTag />
    case 'supply-unlimited':
      return <SupplyUnlimitedXUDTTag />
    case 'rgbpp-compatible':
      return <RGBPPCompatibleXUDTTag />
    default:
      return null
  }
}

const XUDTTag = ({
  content,
  style: { borderColor, background, color },
}: {
  content: string
  style: Pick<CSSProperties, 'borderColor' | 'background' | 'color' | 'borderImage'>
}) => {
  return (
    <div className={classNames(styles.container, styles.normal)} style={{ borderColor, background }}>
      <span style={{ color }}>{content}</span>
    </div>
  )
}

const InvalidXUDTTag = () => (
  <XUDTTag content="Invalid" style={{ borderColor: '#ccc', background: '#f0f0f0', color: '#666' }} />
)

const SuspiciousXUDTTag = () => (
  <XUDTTag content="Suspicious" style={{ borderColor: '#FF9C9C', background: '#FFE8E8', color: '#FA504F' }} />
)

const OutOfLengthRangeXUDTTag = () => (
  <XUDTTag content="Out of Length Range" style={{ borderColor: '#B0CBFC', background: '#D7E5FD', color: '#346DFF' }} />
)

const DuplicateXUDTTag = () => (
  <XUDTTag content="Duplicate" style={{ borderColor: '#FFDBA6', background: '#FFFCF2', color: '#FFA800' }} />
)

const Layer1AssetXUDTTag = () => (
  <XUDTTag content="layer-1-asset" style={{ borderColor: '#E8B0FC', background: '#F1D7FD', color: '#AE4CF7' }} />
)

const Layer2AssetXUDTTag = () => (
  <XUDTTag content="layer-2-asset" style={{ borderColor: '#E8B0FC', background: '#F1D7FD', color: '#AE4CF7' }} />
)

const VerifiedOnPlatformXUDTTag = () => (
  <XUDTTag content="Verified on Platform" style={{ borderColor: '#99E6CA', background: '#D7FDF2', color: '#00BB8E' }} />
)

const SupplyLimitedXUDTTag = () => (
  <XUDTTag content="Supply Limited" style={{ borderColor: '#FCDEB0', background: '#FDF5D7', color: '#CAAC0F' }} />
)

const SupplyUnlimitedXUDTTag = () => (
  <XUDTTag content="Supply Unlimited" style={{ borderColor: '#B0E1FC', background: '#D2F7FF', color: '#00A7CC' }} />
)

const RGBPPCompatibleXUDTTag = () => (
  <div className={classNames(styles.container, styles.rgbppCompatible)}>
    <span>RGB++ Compatible</span>
  </div>
)

export {
  RGBPPCompatibleXUDTTag,
  InvalidXUDTTag,
  SuspiciousXUDTTag,
  OutOfLengthRangeXUDTTag,
  DuplicateXUDTTag,
  Layer1AssetXUDTTag,
  Layer2AssetXUDTTag,
  VerifiedOnPlatformXUDTTag,
  SupplyLimitedXUDTTag,
  SupplyUnlimitedXUDTTag,
  getTag,
}
