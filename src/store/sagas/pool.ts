import { call, put, select, all, spawn, takeEvery, takeLatest } from 'typed-redux-saga'
import { getMarketProgram } from '@web3/programs/amm'
import { Pair } from '@invariant-labs/sdk'
import { actions, PoolWithAddress } from '@reducers/pools'
import { PayloadAction } from '@reduxjs/toolkit'
import { PAIRS } from '@consts/static'
import { Tick } from '@invariant-labs/sdk/src/market'
import { network } from '@selectors/solanaConnection'
import { PublicKey } from '@solana/web3.js'
import { PoolStructure } from '@invariant-labs/sdk/lib/market'
export interface iTick {
  index: Tick[]
}

export function* fetchPoolData(action: PayloadAction<Pair>) {
  const marketProgram = yield* call(getMarketProgram)
  const networkType = yield* select(network)
  try {
    const poolData = yield* call([marketProgram, marketProgram.getPool], action.payload)
    const address = yield* call(
      [action.payload, action.payload.getAddress],
      marketProgram.program.programId
    )

    yield* put(actions.addPool({
      ...poolData,
      address
    }))

    for (let i = 0; i < PAIRS[networkType].length; i++) {
      const ticksArray = yield* call(
        [marketProgram, marketProgram.getAllTicks],
        PAIRS[networkType][i]
      )
      yield* put(actions.setTicks({ index: i, tickStructure: ticksArray }))
    }
    yield* put(actions.initPool(true))
  } catch (error) {
    console.log(error)
  }
}

const fetchPoolFromAddress = async (address: PublicKey) => {
  const marketProgram = await getMarketProgram()

  return (await marketProgram.program.account.pool.fetch(address)) as PoolStructure
}

export function* fetchPoolsDataForPositions(action: PayloadAction<PublicKey[]>) {
  try {
    const newPools: PoolWithAddress[] = []

    for (const address of action.payload) {
      const poolData: PoolStructure = yield* call(fetchPoolFromAddress, address)

      newPools.push({
        ...poolData,
        address
      })
    }

    yield* put(actions.addPoolsForPositions(newPools))
  } catch (error) {
    console.log(error)
  }
}

export function* getPoolsDataForPositionsHandler(): Generator {
  yield* takeEvery(actions.getPoolsDataForPositions, fetchPoolsDataForPositions)
}

export function* getPoolDataHandler(): Generator {
  yield* takeLatest(actions.getPoolData, fetchPoolData)
}

export function* poolsSaga(): Generator {
  yield all(
    [
      getPoolDataHandler,
      getPoolsDataForPositionsHandler
    ].map(spawn)
  )
}
