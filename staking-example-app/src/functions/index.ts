import { BigNumberish } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

export const formatBalance = (
  value: BigNumberish,
  decimals = 18,
  maxFraction = 2
) => {
  if (!value) return null
  const formatted: string =
    typeof value === 'string'
      ? value
      : typeof value === 'number'
      ? value.toString()
      : formatUnits(value, decimals)

  if (maxFraction > 0) {
    const split = formatted.split('.')
    if (split.length > 1) {
      return split[0] + '.' + split[1].substr(0, maxFraction)
    }
  }
  return formatted === '0' ? '0.0' : formatted
}

export const parseBalance = (value: BigNumberish, decimals = 18) => {
  if (!value) return null
  return parseFloat(formatUnits(value, decimals))
}
