/* eslint-disable import/no-extraneous-dependencies */
import { Script } from '@ckb-lumos/base'
import { helpers, type Config } from '@ckb-lumos/config-manager'
import { encodeToAddress, generateAddress } from '@ckb-lumos/helpers'
import { Err, MultiVersionAddress } from './types'

export type ParseResult = MultiVersionAddress | Err

export function parseMultiVersionAddress(script: Script, config: Config): ParseResult {
  try {
    const name = helpers.nameOfScript(script, config.SCRIPTS) as string | undefined
    const ckb2021 = encodeToAddress(script, { config })

    if (script.hashType === 'data1' || script.hashType === 'data2') {
      return {
        name,
        script,
        ckb2019FullFormat: undefined,
        ckb2019ShortFormat: undefined,
        ckb2021FullFormat: ckb2021,
      }
    }

    const ckb2019Full = generateAddress(script, {
      config: { SCRIPTS: {}, PREFIX: config.PREFIX },
    })
    const ckb2019Short = generateAddress(script, { config })

    return {
      script,
      name,
      ckb2019FullFormat: ckb2019Full,
      ckb2019ShortFormat: ckb2019Short === ckb2019Full ? undefined : ckb2019Short,
      ckb2021FullFormat: encodeToAddress(script, { config }),
    }
  } catch {
    return { error: 'Invalid script' }
  }
}
