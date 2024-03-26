import { Script } from '../Script'
import { UDTAccount } from './UDTAccount'

export interface LockInfo {
  status: 'locked' | 'unlocked'
  epochNumber: string
  epochIndex: string
  estimatedUnlockTime: string
}

export interface Address {
  bitcoinAddress?: string
  addressHash: string
  lockHash: string
  balance: string
  balanceOccupied: string
  transactionsCount: string
  lockScript: Script
  pendingRewardBlocksCount: string
  type: 'Address' | 'LockHash' | ''
  daoDeposit: string
  interest: string
  daoCompensation: string
  lockInfo: LockInfo
  liveCellsCount: string
  minedBlocksCount: string
  isSpecial: boolean
  specialAddress: string
  udtAccounts?: UDTAccount[]
}

export * from './UDTAccount'
