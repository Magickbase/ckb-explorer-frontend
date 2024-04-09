import React from 'react'
import { MultiVersionAddress as MultiVersionAddressType } from './types'
import CopyableText from '../../../components/CopyableText'

export const MultiVersionAddress: React.FC<{
  multiVersionAddr: MultiVersionAddressType
  displayName?: boolean
}> = ({ multiVersionAddr, displayName }) => {
  return (
    <>
      {displayName && multiVersionAddr.name && (
        <div>
          <strong>Lock:</strong> {multiVersionAddr.name}
        </div>
      )}
      <div>
        <strong>CKB2021:</strong> <CopyableText>{multiVersionAddr.ckb2021FullFormat}</CopyableText>
      </div>
      {multiVersionAddr.ckb2019ShortFormat && (
        <div>
          <strong>CKB2019(short format):</strong> <CopyableText>{multiVersionAddr.ckb2019ShortFormat}</CopyableText>
        </div>
      )}
      {multiVersionAddr.ckb2019FullFormat && (
        <div>
          <strong>CKB2019(full format):</strong> <CopyableText>{multiVersionAddr.ckb2019FullFormat}</CopyableText>
        </div>
      )}
    </>
  )
}
