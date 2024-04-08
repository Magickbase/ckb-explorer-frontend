import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import { SupportedLng, useCurrentLanguage } from '../../../../utils/i18n'
import styles from './styles.module.scss'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsDataIsStringArrayOf3,
  assertSerialsItem,
  parseNumericAbbr,
} from '../../../../utils/chart'
import { parseSimpleDate } from '../../../../utils/date'
import { isMainnet } from '../../../../utils/chain'
import { tooltipColor, tooltipWidth, SeriesItem, SmartChartPage } from '../../../StatisticsChart/common'
import { ChartItem, explorerService } from '../../../../services/ExplorerService'
import { ChartColorConfig } from '../../../../constants/common'
import { useIsMobile, useIsXXLBreakPoint } from '../../../../hooks'

const widthSpan = (value: string, language: SupportedLng) => tooltipWidth(value, language === 'en' ? 168 : 110)

const useTooltip = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  return ({ seriesName, data, color }: SeriesItem & { data: [string, string, string] }): string => {
    if (seriesName === t('statistic.new_btc_address')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.new_btc_address'),
        currentLanguage,
      )} ${parseNumericAbbr(data[1], 2)}</div>`
    }
    if (seriesName === t('statistic.transaction_num')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.transaction_num'),
        currentLanguage,
      )} ${parseNumericAbbr(data[2], 2, true)}</div>`
    }
    return ''
  }
}

const useOption = (
  statisticBitcoin: ChartItem.Bitcoin[],
  chartColor: ChartColorConfig,
  _: boolean,

  isThumbnail = false,
): echarts.EChartOption => {
  const isXXL = useIsXXLBreakPoint()
  const gridThumbnail = {
    left: '4%',
    right: '10%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '4%',
    right: '3%',
    top: '6%',
    bottom: '5%',
    containLabel: true,
  }
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const parseTooltip = useTooltip()

  return {
    color: chartColor.colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'), currentLanguage)} ${
              dataList[0].data[0]
            }</div>`
            dataList.forEach(data => {
              assertSerialsItem(data)
              assertSerialsDataIsStringArrayOf3(data)
              result += parseTooltip(data)
            })
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    legend: {
      icon: 'roundRect',
      data: isThumbnail
        ? []
        : [
            {
              name: t('statistic.new_btc_address'),
            },
            {
              name: t('statistic.transaction_num'),
            },
          ],
    },
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isXXL || isThumbnail ? '' : t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isXXL || isThumbnail ? '' : t('statistic.new_btc_address'),
        nameTextStyle: {
          align: 'left',
        },
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: chartColor.colors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${parseNumericAbbr(value)}`,
        },
      },
      {
        position: 'right',
        name: isXXL || isThumbnail ? '' : t('statistic.transaction_num'),
        nameTextStyle: {
          align: 'right',
        },
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: chartColor.colors[1],
          },
        },
        splitLine: { show: false },
        axisLabel: {
          formatter: (value: string) => `${parseNumericAbbr(new BigNumber(value))}`,
        },
      },
    ],
    series: [
      {
        name: t('statistic.new_btc_address'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'addresses_count',
        },
      },
      {
        name: t('statistic.transaction_num'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'transaction_num',
        },
      },
    ],
    dataset: {
      source: statisticBitcoin.map(data => [
        parseSimpleDate(data.timestamp),
        data.addressesCount.toString(),
        data.transactionsCount.toString(),
      ]),
      dimensions: ['timestamp', 'addresses_count', 'transaction_num'],
    },
  }
}

export const Chart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  const isMobile = useIsMobile()
  return (
    <div className={styles.container}>
      <SmartChartPage
        style={{ height: isMobile ? '469px' : '641px', borderRadius: '8px' }}
        title={t('statistic.rgbpp_transaction_list')}
        note={isMainnet() ? `${t('common.note')}1GB = 1,000,000,000 CKBytes` : undefined}
        isThumbnail={isThumbnail}
        fetchData={explorerService.api.fetchStatisticBitcoin}
        getEChartOption={useOption}
        queryKey="fetchStatisticBitcoin"
      />
    </div>
  )
}

export default Chart
