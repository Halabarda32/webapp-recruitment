import { Button, Grid, Typography } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import PriceRangePlot, { TickPlotPositionData } from '@components/PriceRangePlot/PriceRangePlot'
import RangeInput from '@components/Inputs/RangeInput/RangeInput'
import { calcPrice, calcTicksAmountInRange2, multiplicityGreaterThan, multiplicityLowerThan, nearestPriceIndex, nearestTickIndex } from '@consts/utils'
import { PlotTickData } from '@reducers/positions'
import useStyles from './style'
import { MIN_TICK } from '@invariant-labs/sdk'
import { MAX_TICK } from '@invariant-labs/sdk/src'

export interface IRangeSelector {
  data: PlotTickData[]
  midPrice: TickPlotPositionData
  tokenFromSymbol: string
  tokenToSymbol: string
  onChangeRange: (leftIndex: number, rightIndex: number) => void
  blocked?: boolean
  blockerInfo?: string
  onZoomOutOfData: (min: number, max: number) => void
  ticksLoading: boolean
  isXtoY: boolean
  xDecimal: number
  yDecimal: number
  tickSpacing: number
}

export const RangeSelector: React.FC<IRangeSelector> = ({
  data,
  midPrice,
  tokenFromSymbol,
  tokenToSymbol,
  onChangeRange,
  blocked = false,
  blockerInfo,
  onZoomOutOfData,
  ticksLoading,
  isXtoY,
  xDecimal,
  yDecimal,
  tickSpacing
}) => {
  const classes = useStyles()

  const [leftRange, setLeftRange] = useState(MIN_TICK)
  const [rightRange, setRightRange] = useState(MAX_TICK)

  const [leftInput, setLeftInput] = useState('')
  const [rightInput, setRightInput] = useState('')

  const [plotMin, setPlotMin] = useState(0)
  const [plotMax, setPlotMax] = useState(1)

  const zoomMinus = () => {
    const diff = plotMax - plotMin
    const newMin = plotMin - (diff / 4)
    const newMax = plotMax + (diff / 4)
    setPlotMin(newMin)
    setPlotMax(newMax)
    // if (newMin < data[0].x || newMax > data[data.length - 1].x) {
    //   onZoomOutOfData(newMin, newMax)
    // }
  }

  const zoomPlus = () => {
    const diff = plotMax - plotMin
    const newMin = plotMin + (diff / 6)
    const newMax = plotMax - (diff / 6)

    if (calcTicksAmountInRange2(Math.max(newMin, 0), newMax, tickSpacing, isXtoY, xDecimal, yDecimal) >= 4) {
      setPlotMin(newMin)
      setPlotMax(newMax)
    }
  }

  const changeRangeHandler = (left: number, right: number) => {
    setLeftRange(left)
    setRightRange(right)

    setLeftInput(calcPrice(left, isXtoY, xDecimal, yDecimal).toString())
    setRightInput(calcPrice(right, isXtoY, xDecimal, yDecimal).toString())

    onChangeRange(left, right)
  }

  const resetPlot = () => {
    const initSideDist = Math.abs(
      midPrice.x - calcPrice(
        Math.max(multiplicityGreaterThan(MIN_TICK, tickSpacing), midPrice.index - (tickSpacing * 15)),
        isXtoY,
        xDecimal,
        yDecimal
      )
    )

    changeRangeHandler(
      isXtoY ? Math.max(multiplicityGreaterThan(MIN_TICK, tickSpacing), midPrice.index - (tickSpacing * 10)) : Math.min(multiplicityLowerThan(MAX_TICK, tickSpacing), midPrice.index + (tickSpacing * 10)),
      isXtoY ? Math.min(multiplicityLowerThan(MAX_TICK, tickSpacing), midPrice.index + (tickSpacing * 10)) : Math.max(multiplicityGreaterThan(MIN_TICK, tickSpacing), midPrice.index - (tickSpacing * 10))
    )
    setPlotMin(midPrice.x - initSideDist)
    setPlotMax(midPrice.x + initSideDist)
  }

  useEffect(() => {
    if (ticksLoading) {
      resetPlot()
    }
  }, [ticksLoading])

  return (
    <Grid container className={classes.wrapper}>
      <Typography className={classes.header}>Price range</Typography>
      <Grid container className={classes.innerWrapper}>
        <PriceRangePlot
          className={classes.plot}
          data={data}
          onChangeRange={changeRangeHandler}
          leftRange={{
            index: leftRange,
            x: calcPrice(leftRange, isXtoY, xDecimal, yDecimal)
          }}
          rightRange={{
            index: rightRange,
            x: calcPrice(rightRange, isXtoY, xDecimal, yDecimal)
          }}
          midPrice={midPrice}
          plotMin={plotMin}
          plotMax={plotMax}
          zoomMinus={zoomMinus}
          zoomPlus={zoomPlus}
          loading={ticksLoading}
          isXtoY={isXtoY}
          tickSpacing={tickSpacing}
          xDecimal={xDecimal}
          yDecimal={yDecimal}
        />
        <Typography className={classes.subheader}>Set price range</Typography>
        <Grid container className={classes.inputs}>
          <RangeInput
            className={classes.input}
            label='Min price'
            tokenFromSymbol={tokenFromSymbol}
            tokenToSymbol={tokenToSymbol}
            currentValue={leftInput}
            setValue={setLeftInput}
            decreaseValue={() => {
              const newLeft = isXtoY
                ? Math.max(multiplicityGreaterThan(MIN_TICK, tickSpacing), leftRange - tickSpacing)
                : Math.min(multiplicityLowerThan(MAX_TICK, tickSpacing), leftRange + tickSpacing)
              changeRangeHandler(newLeft, rightRange)
            }}
            increaseValue={() => {
              const newLeft = isXtoY
                ? Math.min(rightRange - tickSpacing, leftRange + tickSpacing)
                : Math.max(rightRange + tickSpacing, leftRange - tickSpacing)

              changeRangeHandler(newLeft, rightRange)
            }}
            onBlur={() => {
              const newLeft = isXtoY
                ? Math.min(rightRange - tickSpacing, nearestTickIndex(+leftInput, tickSpacing, isXtoY, xDecimal, yDecimal))
                : Math.max(rightRange + tickSpacing, nearestTickIndex(+leftInput, tickSpacing, isXtoY, xDecimal, yDecimal))

              changeRangeHandler(newLeft, rightRange)
            }}
          />
          <RangeInput
            className={classes.input}
            label='Max price'
            tokenFromSymbol={tokenFromSymbol}
            tokenToSymbol={tokenToSymbol}
            currentValue={rightInput}
            setValue={setRightInput}
            decreaseValue={() => {
              const newRight = isXtoY
                ? Math.max(rightRange - tickSpacing, leftRange + tickSpacing)
                : Math.min(rightRange + tickSpacing, leftRange - tickSpacing)
              changeRangeHandler(leftRange, newRight)
            }}
            increaseValue={() => {
              const newRight = isXtoY
                ? Math.min(multiplicityLowerThan(MAX_TICK, tickSpacing), rightRange + tickSpacing)
                : Math.max(multiplicityGreaterThan(MIN_TICK, tickSpacing), rightRange - tickSpacing)
              changeRangeHandler(leftRange, newRight)
            }}
            onBlur={() => {
              const newRight = isXtoY
                ? Math.max(leftRange + tickSpacing, nearestTickIndex(+rightInput, tickSpacing, isXtoY, xDecimal, yDecimal))
                : Math.min(leftRange - tickSpacing, nearestTickIndex(+rightInput, tickSpacing, isXtoY, xDecimal, yDecimal))
              changeRangeHandler(leftRange, newRight)
            }}
          />
        </Grid>
        <Grid container className={classes.buttons}>
          <Button
            className={classes.button}
            onClick={resetPlot}
          >
            Reset range
          </Button>
          <Button
            className={classes.button}
            onClick={() => {
              changeRangeHandler(
                isXtoY ? multiplicityGreaterThan(MIN_TICK, tickSpacing) : multiplicityLowerThan(MAX_TICK, tickSpacing),
                isXtoY ? multiplicityLowerThan(MAX_TICK, tickSpacing) : multiplicityGreaterThan(MIN_TICK, tickSpacing)
              )
            }}
          >
            Set full range
          </Button>
        </Grid>

        {
          blocked && (
            <>
              <Grid className={classes.blocker} />
              <Grid container className={classes.blockedInfoWrapper} justifyContent='center' alignItems='center'>
                <Typography className={classes.blockedInfo}>{blockerInfo}</Typography>
              </Grid>
            </>
          )
        }
      </Grid>
    </Grid>
  )
}

export default RangeSelector
