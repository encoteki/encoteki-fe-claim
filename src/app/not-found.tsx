import Image from 'next/image'
import NotFoundImg from '@/assets/404.webp'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-122 text-center font-normal">
        <Image
          src={NotFoundImg}
          alt="404 Not Found"
          width={999}
          height={999}
          className="m-auto h-45.5 w-68 md:h-81.25 md:w-122"
          loading="eager"
        />
        <h1 className="mb-2 text-2xl font-medium md:text-3xl">
          This page is lost in the wild
        </h1>
        <p className="text-sm md:text-base">
          The page you are looking for cannot be found. Please recheck the URL
          and try again.
        </p>
        <Link href="/">
          <button className="my-8 cursor-pointer rounded-4xl bg-(--primary-green) px-6 py-3 text-white duration-300 hover:scale-105">
            Go back home
          </button>
        </Link>
      </div>
    </div>
  )
}
