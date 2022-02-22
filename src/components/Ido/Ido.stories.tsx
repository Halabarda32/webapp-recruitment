import React from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import Ido from './Ido'
import { SwapToken } from '@components/Swap/Swap'
import { BN } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import IdoLabel from '@components/IdoLabel/IdoLabel'
import { Grid } from '@material-ui/core'
import useStyle from './style'

const tokens: SwapToken[] = [
  {
    balance: new BN(100).mul(new BN(34786)),
    decimals: 6,
    symbol: 'SOL',
    assetAddress: new PublicKey('So11111111111111111111111111111111111111112'),
    name: 'Wrapped Solana',
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    address: new PublicKey('So11111111111111111111111111111111111111112')
  },
  {
    balance: new BN(100).mul(new BN(126)),
    decimals: 6,
    symbol: 'BTC',
    assetAddress: new PublicKey('9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E'),
    name: 'BTC',
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png',
    address: new PublicKey('So11111111111111111111111111111111111111112')
  },
  {
    balance: new BN(10).mul(new BN(5342)),
    decimals: 6,
    symbol: 'USDC',
    assetAddress: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    name: 'USD coin',
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    address: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
  }
]

storiesOf('newUi/Ido', module)
  .addDecorator(withKnobs)
  .add('connect a wallet', () => {
    return (
      <Ido
        xBtc='Deposit your SOL'
        xEth='0.00000 xBTC'
        sol='0.00000 xETH'
        usd='0.0432 SOL'
        xUsd='47.43 USD'
        header='46.643 xUSD'
        buttonHeader='Connect a wallet'
        tokens={tokens}
      />
    )
  })
  .add('sell period', () => {
    return (
      <Ido
        xBtc='Deposit your SOL'
        xEth='0.00000 xBTC'
        sol='0.00000 xETH'
        usd='0.0432 SOL'
        xUsd='47.43 USD'
        header='46.643 xUSD'
        buttonHeader='Connect a wallet'
        tokens={tokens}
      />
    )
  })
  .add('grace period', () => {
    return (
      <Ido
        xBtc='Deposit your SOL'
        xEth='0.00000 xBTC'
        sol='0.00000 xETH'
        usd='0.0432 SOL'
        xUsd='47.43 USD'
        header='46.643 xUSD'
        buttonHeader='Connect a wallet'
        tokens={tokens}
      />
    )
  })
  .add('claiming', () => {
    return (
      <Ido
        xBtc='Deposit your SOL'
        xEth='0.00000 xBTC'
        sol='0.00000 xETH'
        usd='0.0432 SOL'
        xUsd='47.43 USD'
        header='46.643 xUSD'
        buttonHeader='Connect a wallet'
        tokens={tokens}
      />
    )
  })
  .add('mobile', () => {
    const classes = useStyle()

    return (
      <Grid container className={classes.container}>
        <Ido
          xBtc='Deposit your SOL'
          xEth='0.00000 xBTC'
          sol='0.00000 xETH'
          usd='0.0432 SOL'
          xUsd='47.43 USD'
          header='46.643 xUSD'
          buttonHeader='Connect a wallet'
          tokens={tokens}
        />

        <IdoLabel
          sale='15:03:33'
          grace='32:29:27'
          sol='121 124 846'
          estimated='218.839'
          invariant='20 000 000'
          solToken='https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
          estToken='https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        />
      </Grid>
    )
  })
