import { CircleMinus, CirclePlus } from 'lucide-react'
import { FC, useContext, useState } from 'react'
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
  const [addParamSelectValue, setAddParamSelectValue] = useState(ReadContractParameterType.ContextScript)
  const { paramsList, handleAddParam, handleDeleteParam } = useContext(ReadContractContext)
  const { callSSRIMethod, methodResult, isLoading, iconDataURL, transactionResult, isError } = useCallSSRIMethod()

  return (
    <div className={styles.container}>
      <div className={styles.methodName}>
        {index}.{methodName}
      </div>
      <div className={styles.addParamContainer}>
        <div className={styles.addParamTitle}>Add Parameter</div>
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
      <div className={styles.run}>
        <CommonButton
          name="Query"
          onClick={callSSRIMethod}
          disabled={isLoading}
          loading={isLoading}
          className={styles.queryButton}
        />
      </div>
      <div className={`${styles.result} ${isError ? styles.error : ''}`}>
        {(iconDataURL || transactionResult || methodResult) && (
          <img src={ResultIcon} alt="icon" className={styles.resultIcon} />
        )}
        {iconDataURL ? <img src={iconDataURL} alt="icon" width={100} /> : transactionResult || methodResult}
      </div>
    </div>
  )
}

export default MethodCaller
