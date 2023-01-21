import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import AppLayout from '../layouts/AppLayout'
import { DefaultSeo } from 'next-seo'
import { createClient, goerli, WagmiConfig } from 'wagmi'
import { foundry } from 'wagmi/chains'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { useEffect, useState } from 'react'

const wagmiClient = createClient(
  getDefaultClient({
    appName: process.env.NEXT_PUBLIC_APP_NAME || '',
    alchemyId: process.env.ALCHEMY_ID || '',
    chains: [goerli, foundry],
  })
)

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
            <ConnectKitProvider
              options={{
                disclaimer:
                  'Testing purposes only. Do not send real funds to contracts.',
              }}
            >
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </ConnectKitProvider>
          </WagmiConfig>
        </>
      ) : null}
    </>
  )
}

export default MyApp
