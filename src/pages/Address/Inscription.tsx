import classNames from 'classnames'
import styles from './inscription.module.scss'

const Inscription = ({
  href,
  udtLabel,
  mintingStatus,
  content,
}: {
  content: Record<string, string>
  href?: string
  mintingStatus?: string
  udtLabel: string
}) => {
  return (
    <a href={href} className={styles.container}>
      <h5>
        <span className="monospace">{udtLabel}</span>
        <span className="monospace">{mintingStatus}</span>
      </h5>
      <div className={styles.content}>
        {'{'}
        {Object.entries(content).map(([key, value]) => (
          <div className={classNames('monospace', styles.jsonValue)}>
            <div className={classNames('monospace', styles.title)}>{key}:</div>
            <div className="monospace">{value}</div>
          </div>
        ))}
        {'}'}
      </div>
    </a>
  )
}

export default Inscription
