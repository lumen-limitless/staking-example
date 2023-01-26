import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import AppLayout from '../layouts/AppLayout'
import { DefaultSeo } from 'next-seo'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { goerli } from 'wagmi'
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum'

import { Web3Modal } from '@web3modal/react'
import { useEffect, useState } from 'react'

const chains = [goerli]
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: '37c5a16b162db5dc5504f16a8e6c1717' }),
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider,
})

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains)

function MyApp({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  return (
    <>
      {ready ? (
        <>
          <DefaultSeo
            defaultTitle={process.env.NEXT_PUBLIC_APP_NAME || ''}
            titleTemplate={`%s - ${process.env.NEXT_PUBIC_APP_NAME || ''}`}
            description={process.env.NEXT_PUBLIC_APP_DESCRIPTION || ''}
          />
          <Head>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
            />
          </Head>
          <WagmiConfig client={wagmiClient}>
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          </WagmiConfig>
          <Web3Modal
            projectId="37c5a16b162db5dc5504f16a8e6c1717"
            ethereumClient={ethereumClient}
            themeColor="blue"
          />
        </>
      ) : null}
    </>
  )
}

export default MyApp
