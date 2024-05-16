import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { utils } from '@ckb-lumos/base'
import { RadioGroup, RadioGroupItem } from '../../../components/ui/RadioGroup'
import { HashType } from '../../../constants/common'
import styles from './styles.module.scss'
import CopyableText from '../../../components/CopyableText'

export const ScriptToHash: React.FC = () => {
  const [codeHash, setCodeHash] = useState('')
  const [args, setArgs] = useState('')
  const [hash, setHash] = useState<string | undefined>(undefined)
  const [hashType, setHashType] = useState(HashType.TYPE)
  const { t } = useTranslation()

  useMemo(() => {
    try {
      setHash(utils.computeScriptHash({ codeHash, hashType, args }))
    } catch (e) {
      setHash(undefined)
    }
  }, [codeHash, hashType, args])

  const debounceInput = (fn: Function, delay = 300) => {
    let timer: NodeJS.Timeout
    return (value: string) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.call(this, value)
      }, delay)
    }
  }

  const saveCodeHash = debounceInput(setCodeHash)
  const saveArgs = debounceInput(setArgs)

  return (
    <div>
      <div>
        <input
          placeholder={`${t('tools.please_enter')} Code Hash`}
          className={styles.input}
          onChange={e => saveCodeHash(e.target.value)}
        />

        <div className={styles.radioWrapper}>
          <div>Hash Type</div>
          <RadioGroup
            className={styles.radioGroup}
            onValueChange={value => setHashType(value as HashType)}
            value={hashType}
          >
            {Object.values(HashType).map(hashType => (
              <div className={styles.radioItem} key={hashType}>
                <RadioGroupItem value={hashType} id={hashType} />
                <label htmlFor={hashType}>{hashType.toLowerCase()}</label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <input
          className={styles.input}
          placeholder={`${t('tools.please_enter')} Args`}
          onChange={e => saveArgs(e.target.value)}
        />
      </div>

      {args !== '' && codeHash !== '' && (
        <div className={styles.console} style={{ marginBottom: 16 }}>
          <div>
            <strong>Script Hash:</strong> {hash ? <CopyableText>{hash}</CopyableText> : 'Invalid Script'}
          </div>
        </div>
      )}
    </div>
  )
}
