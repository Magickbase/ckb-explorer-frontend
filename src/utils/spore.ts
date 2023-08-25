import { toBigEndian } from '@nervosnetwork/ckb-sdk-utils'
import { hexToUtf8 } from './string'

// parse spore cluster data guideline: https://github.com/sporeprotocol/spore-sdk/blob/beta/docs/recipes/handle-cell-data.md
export function parseSporeClusterData(hexData: string) {
  const data = hexData.slice(2, -1)

  const nameOffset = Number(toBigEndian(`0x${data.slice(8, 16)}`)) * 2
  const descriptionOffset = Number(toBigEndian(`0x${data.slice(16, 24)}`)) * 2

  const name = hexToUtf8(`0x${data.slice(nameOffset + 8, descriptionOffset)}`)
  const description = hexToUtf8(`0x${data.slice(descriptionOffset + 8, -1)}`)

  return { name, description }
}

// parse spore cell data guideline: https://github.com/sporeprotocol/spore-sdk/blob/beta/docs/recipes/handle-cell-data.md
export function parseSporeCellData(hexData: string) {
  const data = hexData.slice(2, -1)

  const contentTypeOffset = Number(toBigEndian(`0x${data.slice(8, 16)}`)) * 2
  const contentOffset = Number(toBigEndian(`0x${data.slice(16, 24)}`)) * 2
  const clusterIdOffset = Number(toBigEndian(`0x${data.slice(24, 32)}`)) * 2

  const contentType = hexToUtf8(`0x${data.slice(contentTypeOffset + 8, contentOffset)}`)
  const content = data.slice(contentOffset + 8, clusterIdOffset)
  const clusterId = `0x${data.slice(clusterIdOffset + 8, -1)}`

  return { contentType, content, clusterId }
}
