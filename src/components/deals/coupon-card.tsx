import { Partner } from '@/types/partners.type'
import Image from 'next/image'
import Link from 'next/link'

export default function CouponCard({ partner }: { partner: Partner }) {
  return (
    <Link
      href={`/deals/EPD${partner.id}`}
      className="group relative flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gray-200 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)]"
    >
      <div className="flex flex-col">
        <div className="relative flex h-32 w-full items-center justify-center rounded-xl bg-gray-50/80 p-4 transition-colors duration-300 group-hover:bg-gray-100/80">
          {partner.image ? (
            <div className="relative h-full w-full">
              <Image
                src={partner.image}
                alt={partner.name}
                fill
                className="object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <span className="text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl">
              {partner.name.charAt(0).toUpperCase()}
            </span>
          )}

          {partner.is_offline && (
            <span className="absolute top-3 right-3 rounded-md border border-gray-100 bg-white/95 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gray-700 uppercase shadow-sm backdrop-blur-sm">
              In-store
            </span>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-5 flex flex-col gap-1.5 px-1">
          <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            {partner.name}
          </p>
          <h3 className="line-clamp-2 text-base leading-snug font-bold text-gray-900 sm:text-lg">
            {partner.offer}
          </h3>
        </div>
      </div>

      {/* Action Footer */}
      <div className="text-primary-green mt-6 flex items-center px-1 text-sm font-semibold transition-colors group-hover:text-green-700">
        View Deal
        <svg
          className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  )
}
