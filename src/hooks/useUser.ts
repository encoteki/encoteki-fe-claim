import useSWR from 'swr'

interface UserData {
  isLoggedIn: boolean
  address?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<UserData>(
    '/api/session',
    fetcher,
    {
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    },
  )

  return {
    user: data?.isLoggedIn ? data : null,
    isLoggedIn: data?.isLoggedIn ?? false,
    isLoading,
    isError: error,
    mutate,
  }
}
