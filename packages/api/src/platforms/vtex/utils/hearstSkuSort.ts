import { FormattedSkuVariant } from "./skuVariants";

export const letterSizeOrder = [
  'XXS', 'XS', 'S', 'M', 'L',
  // XL
  'XL', '1X',
  // XXL
  'XXL', '2X', '2XL',
  // XXXL
  'XXXL', '3X', '3XL',
  // XXXXL
  '4X', '4XL',
  // XXXXXL
  '5X', '5XL'
];

const parseSize = (size: string): number => {
  const parts = size.split('/')
  const primarySize = parts[0]
  const secondarySize = parts[1] || primarySize // use primarySize if no secondary part
  return Math.min(
    letterSizeOrder.indexOf(primarySize),
    letterSizeOrder.indexOf(secondarySize)
  )
}

export const sortLetterSizes = (
  a: FormattedSkuVariant,
  b: FormattedSkuVariant
): number => {
  const aIndex = parseSize(a.value)
  const bIndex = parseSize(b.value)
  return aIndex - bIndex || a.value.localeCompare(b.value) // fallback to lexicographical order if indices are equal
}

export const sortNumericSizes = (
  a: FormattedSkuVariant,
  b: FormattedSkuVariant
): number => {
  // Extract the numeric portion from each value
  const numA = parseFloat(a.value.match(/[\d.]+/)?.[0] || '0')
  const numB = parseFloat(b.value.match(/[\d.]+/)?.[0] || '0')

  // Compare the numeric portions
  return numA - numB
}
