export default function DealsLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="mb-10 flex items-center gap-4">
        <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-7 w-36 animate-pulse rounded-lg bg-gray-200" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="h-32 w-full animate-pulse rounded-xl bg-gray-100" />
            <div className="mt-5 flex flex-col gap-2 px-1">
              <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
              <div className="h-5 w-4/5 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-4 w-3/5 animate-pulse rounded-lg bg-gray-100" />
            </div>
            <div className="mt-6 h-4 w-20 animate-pulse rounded bg-gray-100 px-1" />
          </div>
        ))}
      </div>
    </main>
  )
}
