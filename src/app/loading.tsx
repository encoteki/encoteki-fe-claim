import Image from 'next/image'
import TIGGY from '@/assets/tiggy-tp.webp'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-3">
        <Image
          className="animate-spin"
          alt="Loading"
          src={TIGGY}
          width={100}
          height={100}
          priority
        />
        <p className="text-center text-base font-medium md:text-xl">
          Please wait...
        </p>
      </div>
    </div>
  )
}
