import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { utils } from '@ckb-lumos/base'
import { RadioGroup, RadioGroupItem } from '../../../components/ui/RadioGroup'
import { HashType } from '../../../constants/common'
import styles from './styles.module.scss'
import CopyableText from '../../../components/CopyableText'

export const ScriptToHash: React.FC = () => {
  const [codeHash, setCodeHash] = useState('')
  const [args, setArgs] = useState('')
  const [hashType, setHashType] = useState(HashType.TYPE)
  const { t } = useTranslation()

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
          value={args}
          onChange={e => setArgs(e.target.value)}
        />
      </div>

      {args !== '' && codeHash !== '' && (
        <div className={styles.console} style={{ marginBottom: 16 }}>
          <div>
            <strong>Script Hash:</strong>{' '}
            <CopyableText>{utils.computeScriptHash({ codeHash, hashType, args })}</CopyableText>
          </div>
        </div>
      )}
    </div>
  )
}
