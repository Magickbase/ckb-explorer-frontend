import axios from 'axios'
import config from '../../config'
import { IS_MAINNET } from '../../constants/common'

const { BTC_TEST_IDENTIFIER } = config

export const getBtcChainIdentify = async ({ txid, address }: { txid?: string; address?: string }) => {
  if (IS_MAINNET) {
    return 'mainnet'
  }

  const params: Record<string, string> = {}

  if (txid) {
    params.txid = txid
  }

  if (address) {
    params.address = address
  }

  const identify = await axios
    .get<{ chain: string }>(`${BTC_TEST_IDENTIFIER}/api/signet?${new URLSearchParams(params)}`)
    .catch(() => {
      return {
        data: {
          chain: 'testnet',
        },
      }
    })
  return identify.data.chain
}
