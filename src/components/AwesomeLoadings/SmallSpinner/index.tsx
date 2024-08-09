import styles from './styles.module.scss'
import { ReactComponent as SmallSpinner } from '../../../assets/small-spinner.svg'

const Loading = () => {
  return (
    <div className={styles.container}>
      <SmallSpinner />
    </div>
  )
}
export default Loading
