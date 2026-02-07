/** Simple wallet shape used across views until a real library is integrated. */
export interface Wallet {
  id: string
  name: string
  address: string
  balance: string  // ETH
  usdBalance: number
}
