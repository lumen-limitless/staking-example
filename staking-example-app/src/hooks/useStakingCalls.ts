import {
  DEFAULT_CHAIN_ID,
  STAKING_REWARDS_ABI,
  STAKING_REWARDS_ADDRESS,
  STEAK_TOKEN_ABI,
  STEAK_TOKEN_ADDRESS,
} from './../constants/index'
import { ethers } from 'ethers'
import { useAccount, useContractReads, useNetwork } from 'wagmi'

export const useStakingCalls = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const { data, isLoading, error, isError } = useContractReads({
    watch: true,
    contracts: [
      {
        address: STAKING_REWARDS_ADDRESS[chain?.id ?? DEFAULT_CHAIN_ID],
        abi: STAKING_REWARDS_ABI,
        functionName: 'balanceOf',
        args: [address || ethers.constants.AddressZero],
      },
      {
        address: STAKING_REWARDS_ADDRESS[chain?.id ?? DEFAULT_CHAIN_ID],
        abi: STAKING_REWARDS_ABI,
        functionName: 'totalSupply',
      },

      {
        address: STEAK_TOKEN_ADDRESS[chain?.id ?? DEFAULT_CHAIN_ID],
        abi: STEAK_TOKEN_ABI,
        functionName: 'lastFaucetMint',
        args: [address || ethers.constants.AddressZero],
      },
      {
        address: STAKING_REWARDS_ADDRESS[chain?.id ?? DEFAULT_CHAIN_ID],
        abi: STAKING_REWARDS_ABI,
        functionName: 'rewardRate',
      },
      {
        address: STAKING_REWARDS_ADDRESS[chain?.id ?? DEFAULT_CHAIN_ID],
        abi: STAKING_REWARDS_ABI,
        functionName: 'earned',
        args: [address || ethers.constants.AddressZero],
      },
      {
        address: STAKING_REWARDS_ADDRESS[chain?.id ?? DEFAULT_CHAIN_ID],
        abi: STAKING_REWARDS_ABI,
        functionName: 'paused',
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
    paused: data[5],
  }
}
