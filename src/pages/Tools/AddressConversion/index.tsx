import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs } from 'antd'
import ToolsContainer from '../ToolsContainer'
import { AddressToScript } from './AddressToScript'
import { ScriptToAddress } from './ScriptToAddress'
import styles from './styles.module.scss'

const AddressConversion: FC = () => {
  const { t } = useTranslation()

  return (
    <ToolsContainer>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>{t('tools.address_conversion')}</div>
        <div style={{ marginBottom: 16 }}>
          {t('tools.address_conversion_description')}
          <a
            className={styles.link}
            href="https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md"
            target="_blank"
            rel="noreferrer"
          >
            {t('tools.address_rfc')}
          </a>
        </div>

        <div>
          <Tabs
            type="card"
            items={[
              {
                label: t('tools.address_to_script'),
                key: 'address2script',
                children: <AddressToScript />,
              },
              {
                label: t('tools.script_to_address'),
                key: 'script2address',
                children: <ScriptToAddress />,
              },
            ]}
          />
        </div>
      </div>
    </ToolsContainer>
  )
}

export default AddressConversion
