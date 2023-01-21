import { useEthers } from '@usedapp/core'

export const useWatchToken = (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage: string
) => {
  const { library } = useEthers()
  // useEffect(() => {
  //   try {
  //     const w = window as any
  //     // wasAdded is a boolean. Like any RPC method, an error may be thrown.
  //     const wasAdded = await w.ethereum.request({
  //       method: 'wallet_watchAsset',
  //       params: {
  //         type: 'ERC20', // Initially only supports ERC20, but eventually more!
  //         options: {
  //           address: tokenAddress, // The address that the token is at.
  //           symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
  //           decimals: tokenDecimals, // The number of decimals in the token
  //           image: tokenImage, // A string url of the token logo
  //         },
  //       },
  //     })

  //     if (wasAdded) {
  //       console.log('Thanks for your interest!')
  //     } else {
  //       console.log('Your loss!')
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }, [])
}
