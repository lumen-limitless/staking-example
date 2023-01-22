import { useBoolean } from 'react-use'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { STAKING_REWARDS_ADDRESS } from '../constants'
import ERC20_STAKING_POOL_ABI from '../constants/ERC20StakingPool.abi'
import { parseUnits } from 'ethers/lib/utils.js'

const useStakeCalldata = (amount: string) => {
  const [calldata, setCalldata] = useState<string>('')
  const [isReady, toggle] = useBoolean(false)

  useEffect(() => {
    const get = async () => {
      const contract = new ethers.Contract(
        STAKING_REWARDS_ADDRESS,
        ERC20_STAKING_POOL_ABI
      )

      const unsignedTx = await contract.populateTransaction.stake(
        parseUnits(amount)
      )

      const calldata = unsignedTx.data as string
      setCalldata(calldata)
    }

    toggle(false)
    if (amount !== '') {
      get().then(() => toggle(true))
    }
  }, [amount, toggle])

  if (!isReady) return null

  return calldata
}

export default useStakeCalldata
