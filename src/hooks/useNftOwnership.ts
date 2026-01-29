import { useReadContract } from 'wagmi'
import { erc721Abi, type Address } from 'viem'

export function useNftOwnership(
  contractAddress: Address | undefined,
  userAddress?: Address,
  chainId?: number,
) {
  const {
    data: balance,
    isError,
    error,
    isLoading,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: erc721Abi,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    chainId: chainId,
    query: {
      enabled: !!userAddress && !!contractAddress && !!chainId,
    },
  })

  if (isError) console.error('Read Contract Error:', error)

  const hasNft = balance ? Number(balance) > 0 : false

  return {
    hasNft,
    balance: balance ? Number(balance) : 0,
    isLoading,
    isError,
    refetch,
  }
}
