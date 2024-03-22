/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Root, Trigger, Portal, Content } from 'selection-popover'
import Select from './Select'
import styles from './styles.module.scss'

const DECODER = {
  utf8: 'UTF-8',
  number: 'Number',
  // todo: support decode address & Big-Endian
  // bigend: 'Big-Endian',
}

export const CellInfoDataView: React.FC<{ data: string }> = ({ data }) => {
  const { t } = useTranslation()
  const ref = useRef(null)
  const wrapperRef = useRef(null)
  const [decoderOpen, setDecoderOpen] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [decoder, setDecoder] = useState<keyof typeof DECODER>(Object.keys(DECODER)[0] as keyof typeof DECODER)

  const setSelection = () => {
    const selection = window.getSelection()
    const min = Math.min(selection?.anchorOffset ?? 0, selection?.focusOffset ?? 0)
    const max = Math.max(selection?.anchorOffset ?? 0, selection?.focusOffset ?? 0)
    const text = (selection?.anchorNode?.textContent ?? '').slice(min, max)

    setSelectedText(text)
  }

  const prefix0x = (hex: string) => {
    if (hex.startsWith('0x')) {
      return hex
    }

    if (hex.startsWith('x')) {
      return `0${hex}`
    }

    return `0x${hex}`
  }

  useEffect(() => {
    if (decoderOpen) {
      setSelection()
      window.document.addEventListener('selectionchange', setSelection)
    } else {
      setSelectedText('')
      window.document.removeEventListener('selectionchange', setSelection)
    }
  }, [decoderOpen])

  const decodedText = useMemo(() => {
    if (decoder === 'utf8') {
      const bytes = [...selectedText.matchAll(/[0-9a-f]{2}/g)].map(a => parseInt(a[0], 16))
      return new TextDecoder().decode(new Uint8Array(bytes))
    }

    if (decoder === 'number') {
      if (!selectedText) return '0'
      return BigInt(prefix0x(selectedText)).toString()
    }
  }, [decoder, selectedText])

  return (
    <div ref={wrapperRef} className={styles.dataView}>
      <Root whileSelect onOpenChange={open => setDecoderOpen(open)}>
        <Trigger ref={ref}>{data}</Trigger>
        <Portal container={wrapperRef.current}>
          <Content side="bottom" className={styles.selectionPopover}>
            <div className={styles.selectionPopoverHeader}>
              {t('transaction.view_data_as')}
              <Select
                container={wrapperRef?.current}
                value={decoder}
                onValueChange={e => setDecoder(e as keyof typeof DECODER)}
                options={Object.keys(DECODER).map(key => ({
                  value: key,
                  label: DECODER[key as keyof typeof DECODER],
                }))}
              />
            </div>
            <div className={styles.selectionPopoverContent}>{decodedText}</div>
          </Content>
        </Portal>
      </Root>
    </div>
  )
}
