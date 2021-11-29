import React from 'react'
import { Layer, ResponsiveLine } from '@nivo/line'
// @ts-expect-error
import { linearGradientDef } from '@nivo/core'
import { colors } from '@static/theme'
import { Button, Grid } from '@material-ui/core'
import classNames from 'classnames'
import ZoomInIcon from '@static/svg/zoom-in-icon.svg'
import ZoomOutIcon from '@static/svg/zoom-out-icon.svg'
import Brush from './Brush/Brush'
import useStyles from './style'
import { nearestPriceIndex } from '@consts/utils'

export interface IPriceRangePlot {
  data: Array<{ x: number; y: number }>
  midPriceIndex: number
  leftRangeIndex: number
  rightRangeIndex: number
  onChangeRange?: (left: number, right: number) => void
  style?: React.CSSProperties
  className?: string
  disabled?: boolean
  plotMin: number
  plotMax: number
  zoomMinus: () => void
  zoomPlus: () => void
}

export const PriceRangePlot: React.FC<IPriceRangePlot> = ({
  data,
  leftRangeIndex,
  rightRangeIndex,
  midPriceIndex,
  onChangeRange,
  style,
  className,
  disabled = false,
  plotMin,
  plotMax,
  zoomMinus,
  zoomPlus
}) => {
  const classes = useStyles()

  const getCurrentLessThanRange = () => {
    if (leftRangeIndex > data.length - 1 || data[leftRangeIndex].x < plotMin || disabled) {
      return []
    }

    return data.slice(Math.max(0, nearestPriceIndex(plotMin, data) - 5), Math.min(leftRangeIndex + 1, nearestPriceIndex(plotMax, data) + 5))
  }

  const getCurrentRange = () => {
    if (disabled) {
      return data.slice(Math.max(0, nearestPriceIndex(plotMin, data) - 5), Math.min(data.length, nearestPriceIndex(plotMax, data)) + 5)
    }
    if (leftRangeIndex > data.length - 1 || rightRangeIndex > data.length - 1 || data[leftRangeIndex].x > plotMax || data[rightRangeIndex].x < plotMin) {
      return []
    }

    return data.slice(Math.max(leftRangeIndex, nearestPriceIndex(plotMin, data) - 5), Math.min(rightRangeIndex + 1, nearestPriceIndex(plotMax, data) + 5))
  }

  const getCurrentGreaterThanRange = () => {
    if (rightRangeIndex > data.length - 1 || data[rightRangeIndex].x > plotMax || disabled) {
      return []
    }

    return data.slice(Math.max(rightRangeIndex, nearestPriceIndex(plotMin, data) - 5), Math.min(data.length, nearestPriceIndex(plotMax, data) + 5))
  }

  const currentLayer: Layer = ({ innerWidth, innerHeight }) => {
    const unitLen = innerWidth / (plotMax - plotMin)
    return (
      <rect
        x={(data[midPriceIndex].x - plotMin) * unitLen}
        y={0}
        width={2}
        height={innerHeight}
        fill={colors.invariant.componentOut3}
      />
    )
  }

  return (
    <Grid container className={classNames(classes.container, className)} style={style}>
      <Grid container item className={classes.zoomButtonsWrapper} direction='column' justifyContent='space-between'>
        <Button className={classes.zoomButton} onClick={zoomPlus} disableRipple>
          <img src={ZoomInIcon} className={classes.zoomIcon}/>
        </Button>
        <Button className={classes.zoomButton} onClick={zoomMinus} disableRipple>
          <img src={ZoomOutIcon} className={classes.zoomIcon} />
        </Button>
      </Grid>
      <ResponsiveLine
        data={[
          {
            id: 'less than range',
            data: getCurrentLessThanRange()
          },
          {
            id: 'range',
            data: getCurrentRange()
          },
          {
            id: 'greater than range',
            data: getCurrentGreaterThanRange()
          }
        ]}
        curve='basis'
        margin={{ top: 25, bottom: 15 }}
        colors={[
          colors.invariant.accent1,
          colors.invariant.accent2,
          colors.invariant.accent1
        ]}
        axisTop={null}
        axisRight={null}
        axisLeft={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 0,
          tickRotation: 0,
          tickValues: 5
        }}
        xScale={{
          type: 'linear',
          min: plotMin,
          max: plotMax
        }}
        yScale={{
          type: 'linear',
          min: 0,
          max: Math.max(...(data.map(element => element.y)))
        }}
        enableGridX={false}
        enableGridY={false}
        enablePoints={false}
        enableArea={true}
        legends={[]}
        isInteractive={false}
        animate={false}
        role="application"
        layers={[
          currentLayer,
          'grid',
          'markers',
          'areas',
          'lines',
          ...(
            leftRangeIndex < data.length && rightRangeIndex < data.length
              ? [
                Brush(
                  data[leftRangeIndex].x,
                  data[rightRangeIndex].x,
                  (position) => {
                    const nearest = nearestPriceIndex(plotMin + (position * (plotMax - plotMin)), data)
                    onChangeRange?.(
                      nearest === rightRangeIndex ? rightRangeIndex - 1 : nearest,
                      rightRangeIndex
                    )
                  },
                  (position) => {
                    const nearest = nearestPriceIndex(plotMin + (position * (plotMax - plotMin)), data)
                    onChangeRange?.(
                      leftRangeIndex,
                      nearest === leftRangeIndex ? leftRangeIndex + 1 : nearest
                    )
                  },
                  plotMin,
                  plotMax,
                  disabled
                )
              ]
              : []
          ),
          'axes',
          'legends'
        ]}
        defs={[
          linearGradientDef('gradient', [
            { offset: 0, color: 'inherit' },
            { offset: 50, color: 'inherit' },
            { offset: 100, color: 'inherit', opacity: 0 }
          ])
        ]}
        fill={[
          {
            match: '*',
            id: 'gradient'
          }
        ]}
      />
    </Grid>
  )
}

export default PriceRangePlot
