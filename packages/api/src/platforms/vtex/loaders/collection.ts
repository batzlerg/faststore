import DataLoader from 'dataloader'
import pLimit from 'p-limit'

import { NotFoundError } from '../../errors'
import type { CollectionPageType } from '../clients/commerce/types/Portal'
import type { Options } from '..'
import type { Clients } from '../clients'

// Limits concurrent requests to 20 so that they don't timeout
const CONCURRENT_REQUESTS_MAX = 20

const collectionPageTypes = new Set([
  'brand',
  'category',
  'department',
  'subcategory',
  'collection',
  'cluster',
] as const)

export const isCollectionPageType = (x: any): x is CollectionPageType =>
  typeof x.pageType === 'string' &&
  collectionPageTypes.has(x.pageType.toLowerCase())

export const isInvalidSlug = (slug: string) => slug.includes('.');

export const getCollectionLoader = (_: Options, clients: Clients) => {
  const limit = pLimit(CONCURRENT_REQUESTS_MAX)

  const loader = async (
    slugs: readonly string[]
  ): Promise<CollectionPageType[]> => {
    return Promise.all(
      slugs.map((slug: string) =>
        limit(async () => {
          if (isInvalidSlug(slug)) {
            // if this loader is handling the path, it's already failed to match
            // a static asset or URL redirect/rewrite. everything that passes through
            // here and isn't already slugify'd will confusingly lead to the "Catalog returned"
            // NotFoundError below, so we might as well avoid the call to VTEX.
            throw new NotFoundError(`Invalid slug: ${slug}.`)
          }

          const page = await clients.commerce.catalog.portal.pagetype(slug)

          if (isCollectionPageType(page)) {
            return page
          }

          throw new NotFoundError(
            `Catalog returned ${page.pageType} for slug: ${slug}. This usually happens when there is more than one category with the same name in the same category tree level.`
          )
        })
      )
    )
  }

  return new DataLoader<string, CollectionPageType>(loader, {
    // DataLoader is being used to cache requests, not to batch them
    batch: false,
  })
}
