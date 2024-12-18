import type { Offering } from "../clients/commerce/types/OrderForm";

// todo: this Offering type is recreated in multiple files. unify and import
export const getOfferingReturnability = (offerings?: Offering[]): string | null => {
  if (!offerings?.length) return null;
  return offerings.find(offering => offering.type === 'returnability')?.name || null;
}