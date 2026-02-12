'use client'

import Image from 'next/image'
import Logo from '@/assets/logo.webp'
import { useEffect, useState, useCallback } from 'react'
import { useConnection } from 'wagmi'
import WalletButton from '@/components/button'
import { ConnectButton } from '@xellar/kit'
import Loading from './loading'
import { checkEligibility as checkEligibilityService } from '@/services/airdrop.service'
import { useUser } from '@/hooks/useUser'
import { SignInButton } from '@/components/sign-in-btn'

export default function Mint() {
  const { address, isConnected } = useConnection()
  const { isLoggedIn, isLoading: isSessionLoading } = useUser()

  // State
  const [loading, setLoading] = useState<boolean>(false)
  const [eligible, setEligible] = useState<boolean>(false)
  const [claimCount, setClaimCount] = useState<number>(0)

  const handleCheckEligibility = useCallback(async (userAddress: string) => {
    setLoading(true)
    try {
      const data = await checkEligibilityService(userAddress)

      if (data && data.qty > 0) {
        setClaimCount(data.qty)
        setEligible(true)
      } else {
        setClaimCount(0)
        setEligible(false)
      }
    } catch (error) {
      console.error('Eligibility check failed:', error)
      setClaimCount(0)
      setEligible(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isConnected && address) {
      handleCheckEligibility(address)
    } else {
      setEligible(false)
      setClaimCount(0)
      setLoading(false)
    }
  }, [isConnected, address, handleCheckEligibility])

  if (isSessionLoading) return <Loading />

  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%-64px)] max-w-100 flex-col justify-center gap-6">
      <Image
        src={Logo}
        alt="Encoteki Logo"
        className="mx-auto h-16 w-auto"
        priority
      />
      <h1 className="text-center text-2xl font-medium md:text-3xl">
        Connect a wallet to claim eligibility
      </h1>

      <div className="h-auto w-full rounded-4xl bg-white drop-shadow-xl md:flex md:flex-col">
        {isLoggedIn ? (
          <div className="flex flex-col items-center gap-8 p-6">
            <ConnectButton />

            {loading ? (
              <div className="animate-pulse py-10 text-center">
                <p className="text-xl font-medium text-gray-400">
                  Checking eligibility...
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-xl font-medium md:text-2xl">
                  You’re{' '}
                  <span
                    className={`font-semibold ${
                      eligible
                        ? 'text-(--primary-green)'
                        : 'text-(--primary-red)'
                    }`}
                  >
                    {eligible ? 'ELIGIBLE' : 'INELIGIBLE'}
                  </span>
                </p>

                {eligible ? (
                  <div className="space-y-4 px-4">
                    <p className="text-5xl font-medium md:text-7xl">
                      {claimCount}
                    </p>
                    <p className="text-xl font-medium md:text-2xl">
                      Encoteki TSB NFT
                    </p>
                    <p className="text-neutral-30 text-xs md:text-sm">
                      Make sure to have ETH in your wallet to cover gas fees
                    </p>
                  </div>
                ) : (
                  <div className="px-4">
                    <p className="text-neutral-30 text-xs md:text-sm">
                      You are not eligible for this airdrop. Eligibility
                      requirements must be met to claim rewards.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!loading && eligible && (
              <div className="flex w-full flex-col gap-3">
                <WalletButton label="Claim Now" onClick={() => {}} />
                <SignInButton />
              </div>
            )}
          </div>
        ) : (
          <div className="relative flex flex-col gap-8 p-6">
            <div className="space-y-2 text-center">
              <p className="text-lg font-medium md:text-2xl">
                Connect your wallet
              </p>
              <p className="text-neutral-30 text-xs md:text-sm">
                Connect your Ethereum wallet to check if you’re eligible for
                Encoteki claim
              </p>
            </div>
            <SignInButton />
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-500">
        Any external link other than this related to NFT airdrops or claiming
        rewards is not associated with Encoteki.
      </p>
    </main>
  )
}
