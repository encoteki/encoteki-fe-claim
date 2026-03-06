'use client'

import Loading from '@/app/loading'
import { SignInButton } from '@/components/sign-in-btn'
import Timer from '@/components/timer'
import { NFT_CONTRACTS } from '@/constants/contract'
import { useNftOwnership } from '@/hooks/useNftOwnership'
import { useUser } from '@/hooks/useUser'
import { Partner } from '@/types/partners.type'
import { getPartner } from '@/actions/partners'
import { getDeal } from '@/actions/deals'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Copy, Check } from 'lucide-react'
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

  const [eligible, setEligible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [copied, setCopied] = useState<boolean>(false)

  // State Partner
  const [partner, setPartner] = useState<Partner | null>(null)
  const [partnerId, setPartnerId] = useState<number | null>(null)
  const [eligibleCode, setEligibleCode] = useState<string>('')

  const handleCopy = async () => {
    if (!eligibleCode || copied) return
    await navigator.clipboard.writeText(eligibleCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 1. Initial Load
  useEffect(() => {
    const init = async () => {
      try {
        const { id } = await params
        const normalizedId = id.toUpperCase()
        const strictPattern = /^EPD\d+$/

        if (!strictPattern.test(normalizedId)) {
          return
        }

        const numericPart = normalizedId.substring(3)
        const numericId = parseInt(numericPart, 10)

        if (isNaN(numericId)) {
          return
        }

        setPartnerId(numericId)
        const data = await getPartner(numericId)

        if (data.success && data.data) {
          setPartner(data.data)
        }
      } catch (error) {
        console.error(error)
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
          const json = await getDeal(partnerId)
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
  if (loading || isSessionLoading) return <Loading />
  if (!partner) notFound()

  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%-64px)] max-w-100 flex-col justify-center gap-6">
      <div className="md:flex md:h-125 md:flex-col md:justify-center">
        <section className="h-auto w-full rounded-4xl bg-white drop-shadow-xl">
          <div className="flex flex-col items-center gap-6 p-6">
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
                          <div className="group relative w-fit">
                            <div
                              onClick={handleCopy}
                              className="border-opacity-35 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-(--primary-green) bg-green-50 px-6 py-3 text-lg font-bold text-(--primary-green) transition-colors select-all hover:bg-green-100"
                            >
                              {eligibleCode}
                              <span className="shrink-0">
                                {copied ? (
                                  <Check size={18} className="text-green-600" />
                                ) : (
                                  <Copy size={18} />
                                )}
                              </span>
                            </div>
                            {!copied && (
                              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                                Click to copy
                              </span>
                            )}
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
