import useSWR from 'swr'
import { getSession } from '@/actions/session'

type UserData = Awaited<ReturnType<typeof getSession>>

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<UserData>(
    'session',
    getSession,
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
