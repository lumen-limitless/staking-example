import {
  DEFAULT_CHAIN_ID,
  STAKING_REWARDS_ADDRESS,
  STEAK_TOKEN_ADDRESS,
} from './../constants/index'
import { ethers } from 'ethers'
import { useAccount, useContractReads, useNetwork } from 'wagmi'
import ERC20_STAKING_POOL_ABI from '../constants/ERC20StakingPool.abi'
import STEAK_TOKEN_ABI from '../constants/SteakToken.abi'

export const useStakingCalls = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const { data, isLoading, error, isError } = useContractReads({
    watch: true,
    contracts: [
      {
        address: STAKING_REWARDS_ADDRESS,
        abi: ERC20_STAKING_POOL_ABI,
        functionName: 'balanceOf',
        args: [address || ethers.constants.AddressZero],
      },
      {
        address: STAKING_REWARDS_ADDRESS,
        abi: ERC20_STAKING_POOL_ABI,
        functionName: 'totalSupply',
      },

      {
        address: STEAK_TOKEN_ADDRESS,
        abi: STEAK_TOKEN_ABI,
        functionName: 'lastFaucetMint',
        args: [address || ethers.constants.AddressZero],
      },
      {
        address: STAKING_REWARDS_ADDRESS,
        abi: ERC20_STAKING_POOL_ABI,
        functionName: 'rewardRate',
      },
      {
        address: STAKING_REWARDS_ADDRESS,
        abi: ERC20_STAKING_POOL_ABI,
        functionName: 'earned',
        args: [address || ethers.constants.AddressZero],
      },
    ],
  })

  if (isLoading) return null

  if (isError) {
    console.error(error)
    return null
  }
  if (!data) return null

  return {
    balanceOf: data[0],
    totalSupply: data[1],
    lastFaucetMint: data[2],
    rewardRate: data[3],
    earned: data[4],
  }
}
