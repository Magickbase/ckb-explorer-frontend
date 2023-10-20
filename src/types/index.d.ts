declare namespace State {
  export interface ChartColor {
    areaColor: string
    colors: string[]
    moreColors: string[]
    totalSupplyColors: string[]
    daoColors: string[]
    secondaryIssuanceColors: string[]
    liquidityColors: string[]
  }

  type Theme = { primary: string }
}
