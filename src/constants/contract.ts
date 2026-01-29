import { type Address } from 'viem'

export const NFT_CONTRACTS: Record<number, Address> = {
  84532: process.env.NEXT_PUBLIC_BASE_CONTRACT as Address,
  421614: process.env.NEXT_PUBLIC_ARB_CONTRACT as Address,
}
