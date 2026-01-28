'use client'

import React from 'react'
import { Config, cookieStorage, createStorage, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { XellarKitProvider, defaultConfig, darkTheme } from '@xellar/kit'
import { baseSepolia } from 'viem/chains'

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''
const xellarAppId = process.env.NEXT_PUBLIC_XELLAR_APP_ID || ''

const config = defaultConfig({
  appName: 'Encoteki Claim',
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  walletConnectProjectId,
  xellarAppId,
  xellarEnv: 'sandbox',
  chains: [baseSepolia],
}) as Config

const queryClient = new QueryClient()

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider theme={darkTheme}>{children}</XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
