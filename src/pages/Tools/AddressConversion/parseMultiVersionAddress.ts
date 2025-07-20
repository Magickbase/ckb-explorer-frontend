import { Address, ClientPublicMainnet, ClientPublicTestnet } from '@ckb-ccc/core'
import { matchScript } from '../../../utils/util'
import { Err, MultiVersionAddress } from './types'

export type ParseResult = MultiVersionAddress | Err

export function parseMultiVersionAddress(script: CKBComponents.Script, isMainnet?: boolean): ParseResult {
  try {
    const name = matchScript(script.codeHash)?.tag
    const ckb2021 = Address.fromScript(script, isMainnet ? new ClientPublicMainnet() : new ClientPublicTestnet())

    if (script.hashType === 'data1' || script.hashType === 'data2') {
      return {
        name,
        script,
        ckb2021FullFormat: ckb2021.toString(),
      }
    }

    return {
      name,
      script,
      ckb2021FullFormat: ckb2021.toString(),
    }
  } catch {
    return { error: 'Invalid script' }
  }
}
