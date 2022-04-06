import { printBN } from '@consts/utils'
import { Grid, Typography } from '@material-ui/core'
import BN from 'bn.js'
import React from 'react'
import { Decimal } from '@invariant-labs/sdk/lib/market'
import { DECIMAL } from '@invariant-labs/sdk/lib/utils'
import { useStyles } from './styles'

interface IProps {
  open: boolean
  fee: { v: BN }
  exchangeRate: { val: number; symbol: string }
  decimal: number
  slippage: BN
  minimumReceived: BN
  priceImpact: BN
}

const percentValueDisplay = (amount: Decimal): { value: BN; decimal: number } => {
  const amountLength = amount.v.toString().length - 1
  const amountDec = DECIMAL - amountLength - 2
  const amountValue = amount.v.div(new BN(10).pow(new BN(amountLength)))
  return {
    value: amountValue,
    decimal: amountDec
  }
}

const TransactionDetailsBox: React.FC<IProps> = ({
  open,
  fee,
  exchangeRate,
  decimal,
  slippage,
  minimumReceived,
  priceImpact
}) => {
  const classes = useStyles({ open })

  const feePercent = percentValueDisplay(fee)
  const slippagePercent = percentValueDisplay({ v: slippage })
  const impactPercent = percentValueDisplay({ v: priceImpact })

  return (
    <Grid container direction='column' wrap='nowrap' className={classes.wrapper}>
      <Grid container justifyContent='space-between' className={classes.row}>
        <Typography className={classes.label}>Exchange rate:</Typography>
        <Typography className={classes.value}>{exchangeRate.val.toFixed(decimal)} {exchangeRate.symbol}</Typography>
      </Grid>

      <Grid container justifyContent='space-between' className={classes.row}>
        <Typography className={classes.label}>Fee:</Typography>
        <Typography className={classes.value}>{printBN(feePercent.value, feePercent.decimal)} %</Typography>
      </Grid>

      <Grid container justifyContent='space-between' className={classes.row}>
        <Typography className={classes.label}>Price impact:</Typography>
        <Typography className={classes.value}>{printBN(impactPercent.value, impactPercent.decimal)} %</Typography>
      </Grid>

      <Grid container justifyContent='space-between' className={classes.row}>
        <Typography className={classes.label}>Minimum received:</Typography>
        <Typography className={classes.value}>{printBN(minimumReceived, decimal)} {exchangeRate.symbol}</Typography>
      </Grid>

      <Grid container justifyContent='space-between' className={classes.row}>
        <Typography className={classes.label}>Slippage tolerance:</Typography>
        <Typography className={classes.value}>{printBN(slippagePercent.value, slippagePercent.decimal)} %</Typography>
      </Grid>
    </Grid>
  )
}

export default TransactionDetailsBox
