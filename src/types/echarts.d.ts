declare namespace echarts {
  // https://github.com/apache/echarts/blob/babe688f40feefe3b3f53b31e0d227256fcb36ce/src/util/types.ts#L678-L707
  export type CallbackDataParams = {
    // component main type
    componentType: string
    // component sub type
    componentSubType: string
    componentIndex: number
    // series component sub type
    seriesType?: string
    // series component index (the alias of `componentIndex` for series)
    seriesIndex?: number
    seriesId?: string
    seriesName?: string
    name: string
    dataIndex: number
    data: OptionDataItem
    dataType?: SeriesDataType
    value: OptionDataItem | OptionDataValue
    color?: ZRColor
    opacity?: number
    borderColor?: string
    dimensionNames?: DimensionName[]
    encode?: DimensionUserOuputEncode
    marker?: TooltipMarker
    status?: DisplayState
    dimensionIndex?: number
    percent?: number // Only for chart like 'pie'
  }
}
