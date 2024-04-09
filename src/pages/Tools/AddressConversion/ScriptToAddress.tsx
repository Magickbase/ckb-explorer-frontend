import React, { useMemo, useState } from 'react'
import type { HashType } from '@ckb-lumos/base'
import { useTranslation } from 'react-i18next'
import { Radio } from 'antd'
import { parseMultiVersionAddress, ParseResult } from './parseMultiVersionAddress'
import { MAINNET_CONFIG, TESTNET_CONFIG } from '../constants'
import { MultiVersionAddress } from './MultiVersionAddress'
import { isMultiVersionAddress, isErr } from './types'
import styles from './styles.module.scss'

export const ScriptToAddress: React.FC = () => {
  const [codeHash, setCodeHash] = useState('')
  const [args, setArgs] = useState('')
  const [hashType, setHashType] = useState<HashType>('type')
  const { t } = useTranslation()

  const parsed = useMemo<{ mainnet: ParseResult; testnet: ParseResult }>(() => {
    const mainnet = parseMultiVersionAddress({ codeHash, hashType, args }, MAINNET_CONFIG)

    const testnet = parseMultiVersionAddress({ codeHash, hashType, args }, TESTNET_CONFIG)

    return { mainnet, testnet }
  }, [codeHash, hashType, args])

  return (
    <div>
      <div>
        <input
          placeholder={`${t('tools.please_enter')} Code Hash`}
          className={styles.input}
          value={codeHash}
          onChange={e => setCodeHash(e.target.value)}
        />

        <div className={styles.radioWrapper}>
          <div>Hash Type</div>
          <Radio.Group onChange={({ target: { value } }) => setHashType(value)} value={hashType}>
            <Radio value="type">type</Radio>
            <Radio value="data">data</Radio>
            <Radio value="data1">data1</Radio>
          </Radio.Group>
        </div>

        <input
          className={styles.input}
          placeholder={`${t('tools.please_enter')} Args`}
          value={args}
          onChange={e => setArgs(e.target.value)}
        />
      </div>

      {args !== '' && codeHash !== '' && (
        <div className={styles.console} style={{ marginBottom: 16 }}>
          <h2>Mainnet</h2>
          {isErr(parsed.mainnet) && <>{parsed.mainnet.error}</>}
          {isMultiVersionAddress(parsed.mainnet) && <MultiVersionAddress multiVersionAddr={parsed.mainnet} />}
        </div>
      )}

      {args !== '' && codeHash !== '' && (
        <div className={styles.console} style={{ marginBottom: 16 }}>
          <h2>Testnet</h2>
          {isErr(parsed.testnet) && <>{parsed.testnet.error}</>}
          {isMultiVersionAddress(parsed.testnet) && <MultiVersionAddress multiVersionAddr={parsed.testnet} />}
        </div>
      )}
    </div>
  )
}
