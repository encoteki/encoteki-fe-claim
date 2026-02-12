'use client'

import Loading from '@/app/loading'
import { SignInButton } from '@/components/sign-in-btn'
import Timer from '@/components/timer'
import { NFT_CONTRACTS } from '@/constants/contract'
import { useNftOwnership } from '@/hooks/useNftOwnership'
import { useUser } from '@/hooks/useUser'
import { Partner } from '@/types/partners.type'
import { ConnectButton } from '@xellar/kit'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { useChainId, useConnection } from 'wagmi'

type Params = Promise<{ id: string }>

export default function ClaimDeals({ params }: { params: Params }) {
  const { address } = useConnection()
  const { isLoggedIn, isLoading: isSessionLoading } = useUser()
  const chainId = useChainId()

  const targetContract = useMemo(() => {
    if (!chainId) return undefined
    return NFT_CONTRACTS[chainId]
  }, [chainId])

  const isChainSupported = !!targetContract

  const { hasNft, isLoading: isNftLoading } = useNftOwnership(
    targetContract,
    address,
    chainId,
  )

  const [is404, setIs404] = useState<boolean>(false)
  const [eligible, setEligible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  // State Partner
  const [partner, setPartner] = useState<Partner | null>(null)
  const [partnerId, setPartnerId] = useState<number | null>(null)
  const [eligibleCode, setEligibleCode] = useState<string>('')

  // 1. Initial Load
  useEffect(() => {
    const init = async () => {
      try {
        const { id } = await params
        const normalizedId = id.toUpperCase()
        const strictPattern = /^EPD\d+$/

        if (!strictPattern.test(normalizedId)) {
          setIs404(true)
          return
        }

        const numericPart = normalizedId.substring(3)
        const numericId = parseInt(numericPart, 10)

        if (isNaN(numericId)) {
          setIs404(true)
          return
        }

        setPartnerId(numericId)
        const res = await fetch(`/api/partners?id=${numericId}`)
        const json = await res.json()

        console.dir(json)

        if (json.success && json.data) {
          setPartner(json.data)
        } else {
          setIs404(true)
        }
      } catch (error) {
        console.error(error)
        setIs404(true)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [params])

  // 2. Eligibility Check
  useEffect(() => {
    if (!isLoggedIn || !address) {
      setEligible(false)
      setEligibleCode('')
      return
    }

    const checkEligibility = async () => {
      if (isNftLoading) return

      if (!isChainSupported || !hasNft || !partnerId) {
        setEligible(false)
        setEligibleCode('')
        return
      }

      try {
        if (!partner?.is_offline) {
          const res = await fetch(`/api/deals?id=${partnerId}`)
          const json = await res.json()
          if (json.success && json.data) {
            setEligible(true)
            setEligibleCode(json.data.code || 'CODE-REDEEMED')
          } else {
            setEligible(false)
          }
        } else {
          setEligible(true)
        }
      } catch (error) {
        console.error('Failed to fetch code:', error)
        setEligible(false)
      }
    }

    checkEligibility()
  }, [
    isLoggedIn,
    address,
    isChainSupported,
    hasNft,
    isNftLoading,
    partnerId,
    partner?.is_offline,
  ])

  // --- Render Logic ---
  if (is404) notFound()
  if (loading || isSessionLoading) return <Loading />
  if (!partner) return null

  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%-64px)] max-w-100 flex-col justify-center gap-6">
      <div className="md:flex md:h-125 md:flex-col md:justify-center">
        <section className="h-auto w-full rounded-4xl bg-white drop-shadow-xl">
          <div className="flex flex-col items-center gap-6 p-6">
            {isLoggedIn && <ConnectButton />}
            <Timer />

            <div className="flex w-full flex-col items-center gap-4 text-center">
              {partner.image && (
                <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gray-100">
                  <Image
                    src={partner.image}
                    alt="Partner Image"
                    fill
                    className="object-cover"
                    loading="eager"
                  />
                </div>
              )}

              <p className="text-xl font-medium md:text-2xl">{partner.name}</p>

              {isLoggedIn && (
                <div className="flex w-full flex-col items-center gap-2">
                  {!isChainSupported ? (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-yellow-700">
                      <p className="text-sm font-bold">Unsupported Network</p>
                    </div>
                  ) : isNftLoading ? (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <span className="loading loading-spinner loading-sm"></span>
                      <p className="animate-pulse text-sm">
                        Checking ownership...
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* --- OFFLINE PARTNER LOGIC --- */}
                      {partner.is_offline ? (
                        <p className="text-xl font-medium md:text-2xl">
                          You’re{' '}
                          <span
                            className={`font-semibold ${eligible ? 'text-(--primary-green)' : 'text-(--primary-red)'}`}
                          >
                            {eligible ? 'ELIGIBLE' : 'INELIGIBLE'}
                          </span>
                        </p>
                      ) : /* --- ONLINE PARTNER LOGIC --- */
                      eligible ? (
                        <div className="animate-in fade-in zoom-in mt-2 flex flex-col items-center gap-2 duration-300">
                          <p className="text-sm text-gray-500">
                            Your Voucher Code:
                          </p>
                          <div className="border-opacity-35 w-fit cursor-pointer rounded-xl border border-dashed border-(--primary-green) bg-green-50 px-6 py-3 text-lg font-bold text-(--primary-green) transition-colors select-all hover:bg-green-100">
                            {eligibleCode}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <p className="text-xl font-medium md:text-2xl">
                            You’re{' '}
                            <span className="font-semibold text-(--primary-red)">
                              INELIGIBLE
                            </span>
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <SignInButton />
          </div>
        </section>
      </div>
    </main>
  )
}
