import { ethers } from 'ethers'
import { useAccount, useContractReads, useNetwork } from 'wagmi'
import {
  erc20StakingPoolPerpetualABI,
  erc20StakingPoolPerpetualAddress,
  stakeTokenABI,
  stakeTokenAddress,
} from '../generated'

export const useStakingCalls = () => {
  const { address } = useAccount()

  const { data, isLoading, error, isError } = useContractReads({
    watch: true,
    contracts: [
      {
        address: erc20StakingPoolPerpetualAddress[5],
        abi: erc20StakingPoolPerpetualABI,
        functionName: 'balanceOf',
        args: [address || ethers.constants.AddressZero],
      },
      {
        address: erc20StakingPoolPerpetualAddress[5],
        abi: erc20StakingPoolPerpetualABI,
        functionName: 'totalSupply',
      },

      {
        address: stakeTokenAddress[5],
        abi: stakeTokenABI,
        functionName: 'lastFaucetMint',
        args: [address || ethers.constants.AddressZero],
      },
      {
        address: erc20StakingPoolPerpetualAddress[5],
        abi: erc20StakingPoolPerpetualABI,
        functionName: 'rewardRate',
      },
      {
        address: erc20StakingPoolPerpetualAddress[5],
        abi: erc20StakingPoolPerpetualABI,
        functionName: 'earned',
        args: [address || ethers.constants.AddressZero],
      },
    ],
    enabled: Boolean(address),
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
