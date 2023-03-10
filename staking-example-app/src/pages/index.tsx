import { useMemo, useRef, useState } from 'react'
import { formatBalance, parseBalance } from '../functions'
import { BigNumber, ethers } from 'ethers'
import { NextPage } from 'next'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import Section from '../components/ui/Section'
import Container from '../components/ui/Container'
import WagmiTransactionButton from '../components/WagmiTransactionButton'
import Grid from '../components/ui/Grid'
import Toggle from '../components/ui/Toggle'
import { useBoolean } from 'react-use'
import { useStakingCalls } from '../hooks'
import Spinner from '../components/ui/Spinner'
import { DEFAULT_CHAIN_ID } from '../constants'
import { NextSeo } from 'next-seo'
import Faucet from '../components/faucet'
import { commify, parseUnits } from 'ethers/lib/utils'
import {
  useAccount,
  useBalance,
  useContractRead,
  usePrepareContractWrite,
  useSignTypedData,
} from 'wagmi'

import useStakeCalldata from '../hooks/useStakeCalldata'
import {
  erc20StakingPoolPerpetualAddress,
  stakeTokenAddress,
  useErc20StakingPoolPerpetualRead,
  usePrepareErc20StakingPoolPerpetualExit,
  usePrepareErc20StakingPoolPerpetualGetReward,
  usePrepareErc20StakingPoolPerpetualMulticall,
  usePrepareErc20StakingPoolPerpetualSelfPermitIfNecessary,
  usePrepareErc20StakingPoolPerpetualWithdraw,
  useStakeTokenBalanceOf,
  useStakeTokenNonces,
} from '../generated'

const StakePage: NextPage = () => {
  const [amount, setAmount] = useState<string>('')
  const [isWithdrawing, toggle] = useBoolean(false)

  const { address, isConnected, isDisconnected } = useAccount()

  const tokenBalance = useStakeTokenBalanceOf({
    watch: true,
    args: [address as `0x${string}`],
  })

  const nonces = useStakeTokenNonces({
    watch: true,
    args: [address as `0x`],
  })

  const stakingData = useStakingCalls()

  const apr = useMemo(() => {
    if (!stakingData) return null
    const r = parseBalance(stakingData.rewardRate) as number
    const t = parseBalance(stakingData.totalSupply) as number
    const apr = ((r * 31557600) / t) * 100
    if (isNaN(apr)) return '-%'
    if (apr < 1) return '<1%'
    if (apr > 1000000) return '>1,0000,000%'
    return `${commify(apr.toFixed(2))}%`
  }, [stakingData])

  const handleAmountInput = (input: string) => {
    Number.isNaN(parseFloat(input))
      ? setAmount('')
      : setAmount(input.replace(/\D/g, ''))
    reset()
  }

  const deadline = useRef(BigNumber.from(Math.floor(Date.now() / 1000 + 3600)))

  const {
    data: signature,
    signTypedData,
    isLoading,
    reset,
  } = useSignTypedData({
    domain: {
      verifyingContract: stakeTokenAddress[5],
      version: '1',
      chainId: DEFAULT_CHAIN_ID,
      name: 'StakeToken',
    },
    types: {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    value: {
      owner: address as `0x${string}`,
      spender: erc20StakingPoolPerpetualAddress[5],
      value: parseUnits(amount || '1'),
      nonce: nonces?.data || ethers.constants.One,
      deadline: deadline.current,
    },
  })

  const permit: ethers.Signature | null = useMemo(() => {
    if (!signature) return null
    return ethers.utils.splitSignature(signature)
  }, [signature])

  const selfPermitConfig =
    usePrepareErc20StakingPoolPerpetualSelfPermitIfNecessary({
      args: [
        stakeTokenAddress[5],
        parseUnits(amount || '0'),
        deadline.current,
        permit?.v as number,
        permit?.r as `0x${string}`,
        permit?.s as `0x${string}`,
      ],
      enabled: Boolean(amount !== ''),
    })

  const stakeCalldata = useStakeCalldata(amount)

  const multicallConfig = usePrepareErc20StakingPoolPerpetualMulticall({
    args: [
      [
        selfPermitConfig?.data?.request.data as `0x${string}`,
        stakeCalldata as `0x${string}`,
      ],
    ],
    enabled: Boolean(selfPermitConfig?.data && stakeCalldata),
  })

  const exitConfig = usePrepareErc20StakingPoolPerpetualExit({
    enabled: stakingData?.balanceOf?.gt(0),
  })

  const withdrawConfig = usePrepareErc20StakingPoolPerpetualWithdraw({
    args: [parseUnits(amount || '0')],
    enabled: Boolean(amount !== '') && isWithdrawing,
  })

  const getRewardConfig = usePrepareErc20StakingPoolPerpetualGetReward()

  return (
    <>
      <NextSeo />

      <Section className="py-12">
        <Container>
          {isConnected && stakingData && (
            <Faucet lastFaucetMint={stakingData.lastFaucetMint} />
          )}
          <Grid gap="md">
            <Card className="col-span-12 md:col-span-6">
              <Card.Body>
                <h2 className="text-zinc-500 ">APR</h2>
                <div className="max-w-[66%] text-2xl">
                  {apr || <Skeleton />}
                </div>
              </Card.Body>
            </Card>

            <Card className="col-span-12 md:col-span-6">
              <Card.Body>
                <h2 className=" text-zinc-500">Total Staked</h2>
                <div className="max-w-[66%] text-2xl">
                  {stakingData ? (
                    <p>
                      {commify(formatBalance(stakingData.totalSupply) || '')}
                    </p>
                  ) : (
                    <Skeleton />
                  )}
                </div>
              </Card.Body>
            </Card>

            <Card className="col-span-12">
              <Card.Header>
                <div className="flex items-center  gap-3 p-3">
                  <Toggle
                    className="absolute top-3 right-3"
                    iconSet={{
                      on: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={16}
                          height={16}
                          preserveAspectRatio="xMidYMid meet"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z"
                          />
                        </svg>
                      ),
                      off: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={16}
                          height={16}
                          preserveAspectRatio="xMidYMid meet"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"
                          />
                        </svg>
                      ),
                    }}
                    onToggle={() => toggle()}
                    isActive={isWithdrawing}
                  />
                  <h1>{`${isWithdrawing ? 'Withdraw' : 'Stake'}`}</h1>
                </div>
              </Card.Header>
              <Card.Body>
                {isDisconnected ? (
                  <div className="flex flex-col  items-center ">
                    <Spinner />
                    <p>Connect a wallet</p>
                  </div>
                ) : !stakingData ? (
                  <Spinner />
                ) : (
                  <>
                    <div className="mr-3 flex flex-col items-center gap-3 md:mr-9 md:flex-row">
                      <div className="relative w-full">
                        <input
                          className="w-full rounded p-3 text-sm text-black "
                          type="text"
                          value={amount}
                          placeholder="0.0"
                          onChange={(e) => handleAmountInput(e.target.value)}
                          max={
                            isWithdrawing
                              ? formatBalance(stakingData.balanceOf) || '0'
                              : formatBalance(tokenBalance.data as BigNumber) ||
                                '0'
                          }
                        />
                        <button
                          className="absolute right-9 top-0 bottom-0 p-1 text-black"
                          onClick={() => {
                            setAmount(
                              isWithdrawing
                                ? formatBalance(stakingData.balanceOf) || '0'
                                : formatBalance(
                                    tokenBalance.data as BigNumber
                                  ) || '0'
                            )
                          }}
                        >
                          MAX
                        </button>
                      </div>

                      <div className="flex w-full items-center justify-center gap-3">
                        {amount === '' ? (
                          <>
                            <Button color="gray" full disabled>
                              Enter an amount
                            </Button>
                          </>
                        ) : isWithdrawing ? (
                          <WagmiTransactionButton
                            className="w-full rounded bg-blue-500 p-3"
                            config={withdrawConfig.config}
                            name={`Withdraw ${commify(amount)} Tokens`}
                            onTransactionSuccess={() => reset()}
                          />
                        ) : !permit ? (
                          <>
                            <Button
                              full
                              disabled={isLoading}
                              onClick={() => signTypedData()}
                              color="green"
                            >
                              {isLoading ? <Spinner /> : `Permit Deposit`}
                            </Button>
                          </>
                        ) : (
                          <WagmiTransactionButton
                            className="w-full rounded bg-blue-500 p-3"
                            config={multicallConfig?.config}
                            name={`Stake ${commify(amount)} Tokens`}
                            onTransactionSuccess={() => reset()}
                          />
                        )}
                      </div>
                    </div>
                    <ul className="my-6 max-w-sm space-y-2 rounded p-3 ">
                      <li className="flex">
                        Balance:{' '}
                        {commify(
                          formatBalance(tokenBalance?.data as BigNumber) || '0'
                        )}
                      </li>

                      <li className="flex ">
                        Staked:{' '}
                        {`${commify(
                          formatBalance(stakingData?.balanceOf) || '0'
                        )} `}
                      </li>

                      <li className="flex ">
                        Earnings:{' '}
                        {` ${commify(
                          formatBalance(stakingData.earned) || '0'
                        )} `}
                      </li>
                    </ul>
                    <div className="w-full  items-center justify-center space-y-3 lg:flex lg:gap-3 lg:space-y-0">
                      <WagmiTransactionButton
                        className="w-full rounded bg-green-500 p-3 "
                        config={getRewardConfig?.config}
                        name="Collect Earnings"
                      />

                      <WagmiTransactionButton
                        className="w-full rounded bg-red-500 p-3 "
                        config={exitConfig?.config}
                        name="Exit Staking"
                      />
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Grid>
        </Container>
      </Section>
    </>
  )
}

export default StakePage
