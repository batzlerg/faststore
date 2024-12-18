const stubOosOffer = {
  availableQuantity: 0,
  AvailableQuantity: 0,
  listPrice: 0,
  ListPrice: 0,
  price: 0,
  Price: 0,
  priceWithoutDiscount: 0,
  PriceWithoutDiscount: 0,
  rewardValue: 0,
  RewardValue: 0,
  spotPrice: 0,
  tax: 0,
  Tax: 0,
}
export const stubCommercialOfferIfMissing = (commertialOffer: any) => {
  return commertialOffer ?? stubOosOffer
};
  