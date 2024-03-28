/* eslint-disable import/no-extraneous-dependencies */
import React, { ComponentProps, useEffect, useMemo, useRef, useState, createContext } from 'react'
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

type ContextValue = {
  container?: HTMLElement | null
}

const SelectionParserContext = createContext<ContextValue>({
  container: undefined,
})

export const SelectionParserProvider = SelectionParserContext.Provider

interface Props extends ComponentProps<'div'> {}

export const SelectionParser: React.FC<React.PropsWithChildren<Props>> = ({ children, ...props }) => {
  const { t } = useTranslation()
  const ref = useRef(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [decoderOpen, setDecoderOpen] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [anchorElement, setAnchorElement] = useState<HTMLElement | undefined>(undefined)
  const [decoder, setDecoder] = useState<keyof typeof DECODER>(Object.keys(DECODER)[0] as keyof typeof DECODER)

  const prefix0x = (hex: string) => {
    if (hex.startsWith('0x')) {
      return hex
    }

    if (hex.startsWith('x')) {
      return `0${hex}`
    }

    return `0x${hex}`
  }

  const onSelectionChanged = (e: Event) => {
    e.stopPropagation()
    e.preventDefault()

    const selection = window.getSelection()

    if (!selection) {
      setDecoderOpen(false)
      return
    }

    if (selection.anchorNode !== selection.focusNode) {
      setDecoderOpen(false)
      return
    }

    const min = Math.min(selection.anchorOffset ?? 0, selection.focusOffset ?? 0)
    const max = Math.max(selection.anchorOffset ?? 0, selection.focusOffset ?? 0)
    const text = (selection.anchorNode?.textContent ?? '').slice(min, max)

    setSelectedText(text)
    setAnchorElement(selection.anchorNode?.parentElement ?? undefined)
  }

  useEffect(() => {
    window.document.addEventListener('selectionchange', onSelectionChanged)
    return () => window.document.removeEventListener('selectionchange', onSelectionChanged)
  }, [])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDecoderOpen(false)
      return false
    }

    const selection = window.getSelection()
    if (!selection) {
      setDecoderOpen(false)
      return false
    }

    if (selection.anchorNode !== selection.focusNode) {
      setDecoderOpen(false)
      return false
    }

    setDecoderOpen(true)
    return true
  }

  const decodedText = useMemo(() => {
    try {
      if (decoder === 'utf8') {
        const bytes = [...selectedText.matchAll(/[0-9a-f]{2}/g)].map(a => parseInt(a[0], 16))
        return new TextDecoder().decode(new Uint8Array(bytes))
      }

      if (decoder === 'number') {
        if (!selectedText) return ''
        return BigInt(prefix0x(selectedText)).toString()
      }
    } catch {
      return `Unable to parse ${selectedText} to ${decoder}`
    }
  }, [decoder, selectedText])

  return (
    <div ref={wrapperRef} {...props}>
      <Root whileSelect openDelay={100} open={decoderOpen} onOpenChange={handleOpenChange}>
        <Trigger ref={ref}>{children}</Trigger>
        <Portal container={anchorElement}>
          <Content ref={contentRef} side="bottom" className={styles.selectionPopover}>
            <div className={styles.selectionPopoverHeader}>
              {t('transaction.view_data_as')}
              <Select
                container={contentRef.current}
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
