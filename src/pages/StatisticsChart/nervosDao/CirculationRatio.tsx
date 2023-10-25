import { useTranslation } from 'react-i18next'
import { useCurrentLanguage } from '../../../utils/i18n'
import { parseDateNoTime } from '../../../utils/date'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../common'
import { DATA_ZOOM_CONFIG, assertIsArray } from '../../../utils/chart'
import { ChartCachedKeys } from '../../../constants/cache'
import { ChartItem, explorerService } from '../../../services/ExplorerService'

const useOption = (
  statisticCirculationRatios: ChartItem.CirculationRatio[],
  chartColor: State.ChartColor,
  isMobile: boolean,
  isThumbnail = false,
): echarts.EChartOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const gridThumbnail = {
    left: '4%',
    right: '10%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '3%',
    right: '3%',
    top: '5%',
    bottom: '5%',
    containLabel: true,
  }
  return {
    color: chartColor.colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 185 : 165)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${dataList[0].data[0]}</div>`
            if (dataList[0].data) {
              result += `<div>${tooltipColor(chartColor.colors[0])}${widthSpan(t('statistic.circulation_ratio'))} ${
                dataList[0].data[1]
              }%</div>`
            }
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile || isThumbnail ? '' : t('statistic.circulation_ratio'),
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
          formatter: (value: string) => `${value}%`,
        },
      },
    ],
    series: [
      {
        name: t('statistic.circulation_ratio'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
      },
    ],
    dataset: {
      source: statisticCirculationRatios.map(data => [
        parseDateNoTime(data.createdAtUnixtimestamp),
        (+data.circulationRatio * 100).toFixed(2),
      ]),
    },
  }
}

const toCSV = (statisticCirculationRatios: ChartItem.CirculationRatio[]) =>
  statisticCirculationRatios
    ? statisticCirculationRatios.map(data => [data.createdAtUnixtimestamp, data.circulationRatio])
    : []

export const CirculationRatioChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.circulation_ratio')}
      description={t('statistic.deposit_to_circulation_ratio_description')}
      isThumbnail={isThumbnail}
      fetchData={explorerService.api.fetchStatisticCirculationRatio}
      getEChartOption={useOption}
      toCSV={toCSV}
      cacheKey={ChartCachedKeys.DepositCirculationRatio}
      cacheMode="date"
    />
  )
}

export default CirculationRatioChart
