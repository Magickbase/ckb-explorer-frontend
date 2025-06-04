import { ChevronDown, ChevronUp, CircleMinus, CirclePlus } from 'lucide-react'
import { FC, ReactNode, useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './MethodCaller.module.scss'
import CommonSelect from '../../../components/CommonSelect'
import { ReadContractContext } from './context'
import ParameterBuilder from './ParameterBuilder'
import { ReadContractParameterType } from './types'
import CommonButton from '../../../components/CommonButton'
import { useCallSSRIMethod } from './useCallSSRIMethod'
import ResultIcon from './result_icon.png'

const MethodCaller: FC<{
  methodName: string
  index: number
}> = ({ methodName, index }) => {
  const { t } = useTranslation()
  const [addParamSelectValue, setAddParamSelectValue] = useState(ReadContractParameterType.ContextScript)
  const { paramsList, handleAddParam, handleDeleteParam, expandedMethods, setExpandedMethods } =
    useContext(ReadContractContext)
  const { callSSRIMethod, methodResult, isLoading, iconDataURL, transactionResult, isError, ckbAddress } =
    useCallSSRIMethod()

  const handleExpand = useCallback(() => {
    if (expandedMethods.includes(methodName)) {
      setExpandedMethods(expandedMethods.filter(name => name !== methodName))
    } else {
      setExpandedMethods([...expandedMethods, methodName])
    }
  }, [expandedMethods, methodName, setExpandedMethods])

  let result: ReactNode = null
  if (iconDataURL) {
    result = <img src={iconDataURL} alt="icon" width={100} />
  } else if (transactionResult) {
    result = (
      <a href={`/transaction/${transactionResult.hash}`} target="_blank" rel="noreferrer">
        {transactionResult.hash}
      </a>
    )
  } else if (methodResult) {
    result = <div>{methodResult}</div>
  } else if (ckbAddress) {
    result = (
      <a href={`/address/${ckbAddress}`} target="_blank" rel="noreferrer">
        {ckbAddress}
      </a>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.methodName} onClick={handleExpand}>
        <span>
          {index}.{methodName}
        </span>
        {expandedMethods.includes(methodName) ? (
          <ChevronUp className={styles.expandIcon} />
        ) : (
          <ChevronDown className={styles.expandIcon} />
        )}
      </div>
      <div className={`${styles.content} ${!expandedMethods.includes(methodName) ? styles.contentHidden : ''}`}>
        <div className={styles.addParamContainer}>
          <div className={styles.addParamTitle}>{t('xudt.read_contract.add_parameter')}</div>
          <CommonSelect
            className={styles.paramSelect}
            options={Object.values(ReadContractParameterType).map(type => ({
              value: type,
              label: type,
            }))}
            onChange={(value: string) => setAddParamSelectValue(value as ReadContractParameterType)}
            value={addParamSelectValue}
          />
          <CirclePlus
            onClick={() => handleAddParam(addParamSelectValue as ReadContractParameterType)}
            className={styles.addIcon}
          />
        </div>
        {paramsList.length > 0 && (
          <div className={styles.paramsList}>
            {paramsList.map((param, index) => (
              <div key={param.title} className={styles.paramItem}>
                <div className={styles.paramHeader}>
                  <div className={styles.paramTitle}>
                    {param.title}
                    <span className={styles.paramType}>
                      ({Object.values(ReadContractParameterType).find(option => option === param.type)})
                    </span>
                  </div>
                  <CircleMinus className={styles.deleteIcon} onClick={() => handleDeleteParam(index)} />
                </div>
                <ParameterBuilder type={param.type} index={index} />
              </div>
            ))}
          </div>
        )}
        <div className={styles.run}>
          <CommonButton
            name={t('xudt.read_contract.query')}
            onClick={callSSRIMethod}
            disabled={isLoading}
            loading={isLoading}
            className={styles.queryButton}
          />
        </div>
        {(iconDataURL || transactionResult || methodResult || ckbAddress) && (
          <div className={`${styles.result} ${isError ? styles.error : ''}`}>
            <img src={ResultIcon} alt="icon" className={styles.resultIcon} />
            {result}
          </div>
        )}
      </div>
    </div>
  )
}

export default MethodCaller
