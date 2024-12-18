import type { CommertialOffer } from '../clients/search/types/ProductSearchResult'
import { stubCommercialOfferIfMissing } from './stubCommercialOfferIfMissing'

export type EnhancedCommercialOffer<S, P> = CommertialOffer & {
  seller: S
  product: P
}

export const enhanceCommercialOffer = <S, P>({
  offer,
  seller,
  product,
}: {
  offer: CommertialOffer
  seller: S
  product: P
}): EnhancedCommercialOffer<S, P> => ({
  ...stubCommercialOfferIfMissing(offer),
  product,
  seller,
})
