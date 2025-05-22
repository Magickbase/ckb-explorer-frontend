import styles from './index.module.scss'
import bg1 from './bg-1.webp'
import bg2 from './bg-2.webp'
import bg3 from './bg-3.webp'
import mbg1 from './mbg-1.webp'
import mbg2 from './mbg-2.webp'
import mbg3 from './mbg-3.webp'
import { useIsMobile } from '../../hooks'

const data = [
  {
    time: 'June 1, 2025 — October 30, 2025',
    title: 'Godwoken Phase-out',
    content:
      'Godwoken will enter 5-months phase-out period starting June 1, 2025. Users are adivced to withdraw all assets through Godwoken Bridge before October 31, 2025. During this period, inflow will be disabled, and support will focus on ensuring smooth exits.Godwoken will enter 5-months phase-out period starting June 1, 2025. Users are adivced to withdraw all assets through Godwoken Bridge before October 31, 2025. During this period, inflow will be disabled, and support will focus on ensuring smooth exits.',
    bg: bg1,
    mbg: mbg1,
    color: '#fff',
    backgroundColor: '#333',
  },
  {
    time: 'June 1, 2025 — December 1, 2025',
    title: 'Force Bridge Sunset Period',
    content:
      'Force Bridge will sunset over a 6-months period from June 1 to November 30, 2025. Users should withdraw bridged assets before the deadline. Unclaimed funds will be transferred to a DAO-controlled community pool post-shutdown.',
    bg: bg2,
    mbg: mbg2,
    color: '#333',
    backgroundColor: '#fff',
  },
  {
    time: 'October 30, 2025 — December 1, 2025',
    title: 'Godwoken Service Freeze',
    content:
      'On October 31, 2025, all Godwoken services will be halted. The chain will no longer accept transactions. A final snapshot of remaining assets will be taken and published. These assets will remain on-chain but will no longer be retrievable through standard front-end interfaces.',
    bg: bg3,
    mbg: mbg3,
    color: '#fff',
    backgroundColor: '#333',
  },
]

const ForceBridgeExit = () => {
  const isMobile = useIsMobile()

  return (
    <div className={styles.container}>
      {data.map(item => (
        <div
          className={styles.item}
          key={item.title}
          style={{
            backgroundImage: `url(${isMobile ? item.mbg : item.bg})`,
            color: item.color,
            backgroundColor: item.backgroundColor,
            padding: isMobile ? '60px' : '100px 120px',
            minHeight: '470px',
          }}
        >
          <div className={styles.time}>{item.time}</div>
          <div className={styles.title}>{item.title}</div>
          <div className={styles.content}>{item.content}</div>
        </div>
      ))}
    </div>
  )
}

export default ForceBridgeExit
