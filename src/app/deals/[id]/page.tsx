'use client'

import Loading from '@/app/loading'
import { SignInButton } from '@/components/sign-in-btn'
import Timer from '@/components/timer'
import { NFT_CONTRACTS } from '@/constants/contract'
import { useNftOwnership } from '@/hooks/useNftOwnership'
import { useUser } from '@/hooks/useUser'
import { getDeals, Partner } from '@/services/deals.service'
import { ConnectButton } from '@xellar/kit'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { useConnection, useChainId } from 'wagmi'

type Params = Promise<{ id: string }>

export default function ClaimDeals({ params }: { params: Params }) {
  const { address } = useConnection()
  const { isLoggedIn } = useUser()
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
  const [partner, setPartner] = useState<Partner>({
    id: 0,
    name: '',
    description: '',
    offer: '',
    tnc: '',
    image: '',
    code: '',
    is_offline: undefined,
  })

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
        const data = await getDeals(numericId)

        if (data) {
          setPartner(data)
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

  useEffect(() => {
    if (isNftLoading) {
      setEligible(false)
      return
    }

    if (isLoggedIn && isChainSupported && hasNft) {
      setEligible(true)
    } else {
      setEligible(false)
    }
  }, [isLoggedIn, isChainSupported, hasNft, isNftLoading])

  if (is404) {
    notFound()
  }

  if (loading) return <Loading />

  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%-64px)] max-w-100 flex-col justify-center gap-6">
      <div className="md:flex md:h-125 md:flex-col md:justify-center">
        <section className="h-auto w-full rounded-4xl bg-white drop-shadow-xl">
          <div className="flex flex-col items-center gap-6 p-6">
            <ConnectButton />
            <Timer />

            <div className="flex w-full flex-col items-center gap-4 text-center">
              {isLoggedIn && (
                <div className="flex flex-col gap-2">
                  {!isChainSupported ? (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-yellow-700">
                      <p className="text-sm font-bold">Unsupported Network</p>
                    </div>
                  ) : isNftLoading ? (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <span className="loading loading-spinner loading-sm"></span>
                      <p className="animate-pulse text-sm">Please wait...</p>
                    </div>
                  ) : (
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
                  )}
                </div>
              )}

              <Image
                src={partner.image}
                alt="Partner Image"
                width={100}
                height={100}
                loading="eager"
              />

              <p className="text-xl font-medium md:text-2xl">{partner?.name}</p>

              {partner.is_offline === false && isLoggedIn && eligible && (
                <div className="border-opacity-35 w-fit rounded-xl border border-dashed border-(--primary-green) p-3 text-lg font-semibold text-(--primary-green)">
                  {partner?.code}
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
