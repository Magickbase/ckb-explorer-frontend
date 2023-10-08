import Content from '../../components/Content'
import Search from '../../components/Search'
import { I18nType, useI18n } from '../../utils/i18n'
import { SearchFailType, MAINNET_URL, TESTNET_URL } from '../../constants/common'
import { isMainnet } from '../../utils/chain'
import { SearchContent, SearchPanel } from './styled'
import { useSearchParams } from '../../utils/hook'

const chainErrorMessage = (i18n: I18nType) =>
  isMainnet() ? i18n.t('search.address_type_testnet_error') : i18n.t('search.address_type_mainnet_error')

const chainUrlMessage = (i18n: I18nType) =>
  isMainnet() ? i18n.t('search.address_type_testnet_url') : i18n.t('search.address_type_mainnet_url')

const targetUrl = isMainnet() ? TESTNET_URL : MAINNET_URL

export default ({ address }: { address?: string }) => {
  const { i18n } = useI18n()
  const params = useSearchParams('q', 'type')
  const { q, type } = params
  const query = address || q

  return (
    <Content>
      <SearchPanel className="container">
        <div className="search__fail__bar">
          <Search content={query as string} hasButton />
        </div>
        <SearchContent>
          {type === SearchFailType.CHAIN_ERROR || address ? (
            <div>
              <span>{chainErrorMessage(i18n)}</span>
              <a href={`${targetUrl}address/${q}`} rel="noopener noreferrer">
                {chainUrlMessage(i18n)}
              </a>
            </div>
          ) : (
            <>
              <span>{i18n.t('search.empty_result')}</span>
              <span className="search__fail__items">{i18n.t('search.empty_result_items')}</span>
            </>
          )}
        </SearchContent>
      </SearchPanel>
    </Content>
  )
}
