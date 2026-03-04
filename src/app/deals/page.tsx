import Image from 'next/image'
import Link from 'next/link'
import { getAllPartners } from '@/actions/partners'
import Logo from '@/assets/logo.webp'
import CouponCard from '@/components/deals/coupon-card'

type SearchParams = Promise<{ page?: string }>

function PaginationLink({
  page,
  disabled,
  active,
  label,
}: {
  page: number
  disabled?: boolean
  active?: boolean
  label: string
}) {
  if (disabled) {
    return (
      <span className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-xl text-sm font-medium text-gray-300">
        {label}
      </span>
    )
  }

  return (
    <Link
      href={`/deals?page=${page}`}
      className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-primary-green shadow-primary-green/20 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {label}
    </Link>
  )
}

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5 py-6 sm:gap-2">
      <PaginationLink
        page={currentPage - 1}
        disabled={currentPage === 1}
        label="Prev"
      />
      <div className="hidden sm:flex sm:gap-2">
        {pages.map((p) => (
          <PaginationLink
            key={p}
            page={p}
            active={p === currentPage}
            label={String(p)}
          />
        ))}
      </div>
      <span className="flex h-10 items-center px-4 text-sm font-medium text-gray-500 sm:hidden">
        Page {currentPage} of {totalPages}
      </span>
      <PaginationLink
        page={currentPage + 1}
        disabled={currentPage === totalPages}
        label="Next"
      />
    </nav>
  )
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const result = await getAllPartners(page)
  const partners = result.success ? (result.data ?? []) : []
  const totalPages = result.success ? (result.totalPages ?? 1) : 1

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center">
            <Image src={Logo} alt="Encoteki" className="h-8 w-auto" priority />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-gray-900 sm:text-3xl">
              Partner Deals
            </h1>
          </div>
        </div>
      </div>

      {/* Error State */}
      {!result.success && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-600 shadow-sm">
          {result.message}
        </div>
      )}

      {/* Empty State */}
      {result.success && partners.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 py-32">
          <p className="text-lg font-medium text-gray-900">
            No deals available
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Check back later for new offers and partnerships.
          </p>
        </div>
      )}

      {/* Grid */}
      {result.success && partners.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {partners.map((partner) => (
              <CouponCard key={partner.id} partner={partner} />
            ))}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      )}
    </main>
  )
}
