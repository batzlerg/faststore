import type { Context, Options } from '../../'
import type { IStoreSelectedFacet } from '../../../../__generated__/schema'
import { getStoreCookie } from '../../utils/cookies'
import type { SelectedFacet } from '../../utils/facets'
import { fetchAPI } from '../fetch'
import type {
  Facet,
  FacetSearchResult,
  FacetValueBoolean,
} from './types/FacetSearchResult'
import type {
  ProductSearchResult,
  Suggestion,
} from './types/ProductSearchResult'
import { checkSponsoredProductsEnabled, checkSponsoredTestProductsEnabled } from '../../utils/featureFlags'
import { determineDeviceType } from '../../utils/getDeviceViewer'

export type Sort =
  | 'price:desc'
  | 'price:asc'
  | 'orders:desc'
  | 'name:desc'
  | 'name:asc'
  | 'release:desc'
  | 'discount:desc'
  | ''

export interface SearchArgs {
  query?: string
  page: number
  count: number
  type: 'product_search' | 'facets' | 'product_detail'
  sort?: Sort
  selectedFacets?: SelectedFacet[]
  fuzzy?: '0' | '1' | 'auto'
  hideUnavailableItems?: boolean
  showInvisibleItems?: boolean
}

export interface ProductLocator {
  field: 'id' | 'slug'
  value: string
}

const POLICY_KEY = 'trade-policy'
const REGION_KEY = 'region-id'
const CHANNEL_KEYS = new Set([POLICY_KEY, REGION_KEY])

export const isFacetBoolean = (
  facet: Facet
): facet is Facet<FacetValueBoolean> => facet.type === 'TEXT'

export const IntelligentSearch = (
  { account, environment, hideUnavailableItems, simulationBehavior, ecmSearchAccount }: Options,
  ctx: Context
) => {

  const base = `https://${account}.${environment}.com.br/api/io`
  const storeCookies = getStoreCookie(ctx)

  const getPolicyFacet = (): IStoreSelectedFacet | null => {
    const { salesChannel } = ctx.storage.channel

    if (!salesChannel) {
      return null
    }

    return {
      key: POLICY_KEY,
      value: salesChannel,
    }
  }

  const getRegionFacet = (): IStoreSelectedFacet | null => {
    const { regionId, seller } = ctx.storage.channel
    const sellerRegionId = seller
      ? Buffer.from(`SW#${seller}`).toString('base64')
      : null
    const facet = sellerRegionId ?? regionId

    if (!facet) {
      return null
    }

    return {
      key: REGION_KEY,
      value: facet,
    }
  }

  const addDefaultFacets = (facets: SelectedFacet[]) => {
    const withDefaultFacets = facets.filter(({ key }) => !CHANNEL_KEYS.has(key))

    const policyFacet =
      facets.find(({ key }) => key === POLICY_KEY) ?? getPolicyFacet()

    const regionFacet =
      facets.find(({ key }) => key === REGION_KEY) ?? getRegionFacet()

    if (policyFacet !== null) {
      withDefaultFacets.push(policyFacet)
    }

    if (regionFacet !== null) {
      withDefaultFacets.push(regionFacet)
    }

    return withDefaultFacets
  }

  const search = <T>({
    query = '',
    page,
    count,
    sort = '',
    selectedFacets = [],
    type,
    fuzzy = 'auto',
    showInvisibleItems,
  }: SearchArgs): Promise<T> => {
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      count: count.toString(),
      query,
      sort,
      fuzzy,
      locale: ctx.storage.locale,
    })

    if (showInvisibleItems) {
      params.append('show-invisible-items', 'true')
    }

    if (hideUnavailableItems !== undefined) {
      params.append('hideUnavailableItems', hideUnavailableItems.toString())
    }

    if (simulationBehavior !== undefined) {
      params.append('simulationBehavior', simulationBehavior.toString())
    }

    const pathname = addDefaultFacets(selectedFacets)
      .map(({ key, value }) => `${key}/${value}`)
      .join('/')

    return fetchAPI(
      `${base}/_v/api/intelligent-search/${type}/${pathname}?${params.toString()}`,
      undefined,
      { storeCookies }
    )
  }

  const products = (args: Omit<SearchArgs, 'type'>) =>
    search<ProductSearchResult>({ ...args, type: 'product_search' })

  const EcmSearch = <T>({
    query = '',
    page,
    count,
    sort = '',
    selectedFacets = [],
    type,
    fuzzy = 'auto',
    showInvisibleItems,
  }: SearchArgs): Promise<T> => {
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      count: count.toString(),
      query,
      sort,
      fuzzy,
      locale: ctx.storage.locale,
    })

    if (showInvisibleItems) {
      params.append('show-invisible-items', 'true')
    }

    if (hideUnavailableItems !== undefined) {
      params.append('hideUnavailableItems', hideUnavailableItems.toString())
    }

    if (simulationBehavior !== undefined) {
      params.append('simulationBehavior', simulationBehavior.toString())
    }

    const isSponsoredProductsEnabled = checkSponsoredProductsEnabled(ctx)
    const isTestRMNEnabled = checkSponsoredTestProductsEnabled(ctx);

    if (!isSponsoredProductsEnabled && !isTestRMNEnabled) {
      params.append('no_ads', "y")
    }

    const pathname = addDefaultFacets(selectedFacets)
      .map(({ key, value }) => `${key}/${value}`)
      .join('/')

    const ogRequestHeaders = new Headers(ctx.headers)
    const ogForwardedFor = ogRequestHeaders.get('x-forwarded-for') ?? ''
    const userAgent = ogRequestHeaders.get('user-agent') ?? ''
    const viewierCountry = ogRequestHeaders.get('cloudfront-viewer-country') ?? ''
    const secUAaBrowser= ogRequestHeaders.get('sec-ch-ua') ?? ''
    const secUAaPlatform = ogRequestHeaders.get('sec-ch-ua-platform') ?? ''
    const noAds = ogRequestHeaders.get('x-no-ads') ?? ''
    const referer = ogRequestHeaders.get('referer') ?? ''
    const cookies = ogRequestHeaders.get('cookie') ?? ''
    const ofidMatch = cookies?.match(/__ofid=([^;]+)/)
    const cartId = ofidMatch ? ofidMatch[1] : ''

    const customerDeviceType = determineDeviceType(ogRequestHeaders)
    
    const requestInit = {
      headers: {
        'x-original-forwarded-for': ogForwardedFor,
        'x-vtexcustomer-user-agent': userAgent,
        'x-vtexcustomer-viewer-country': viewierCountry,
        'x-vtexcustomer-device-type': customerDeviceType,
        'x-vtexcustomer-sec-ch-ua': secUAaBrowser,
        'x-vtexcustomer-sec-ch-ua-platform': secUAaPlatform,
        'x-vtexcustomer-referer': referer,
        'x-vtexcustomer-cart-id': cartId,
        'x-vtexcustomer-cookies': cookies,
        'x-no-ads': noAds,
      },
    }

    const targetUrl = encodeURI(`https://${ecmSearchAccount}.${environment}.com.br/api/io/_v/ecm-search/${type}/${pathname}?${params.toString()}`);

    ctx.logger.info(`request to ECM Search`, {
      type,
      url: targetUrl,
      forwardedHeaders: requestInit,
      ...(ecmSearchAccount !== 'hearst' && { headers: JSON.stringify(ctx.headers)})
    })

    return fetchAPI(
      targetUrl,
      requestInit,
      { storeCookies }
    )
  }

  const ecmProducts = (args: Omit<SearchArgs, 'type'>) =>
    EcmSearch<ProductSearchResult>({ ...args, type: 'product_search' })

  const ecmProductDetail = (args: Omit<SearchArgs, 'type'>) =>
    EcmSearch<ProductSearchResult>({ ...args, type: 'product_detail' })

  const ecmFacets = (args: Omit<SearchArgs, 'type'>) =>
    EcmSearch<FacetSearchResult>({ ...args, type: 'facets' })

  const suggestedTerms = (
    args: Omit<SearchArgs, 'type'>
  ): Promise<Suggestion> => {
    const params = new URLSearchParams({
      query: args.query?.toString() ?? '',
      locale: ctx.storage.locale,
    })

    return fetchAPI(
      `${base}/_v/api/intelligent-search/search_suggestions?${params.toString()}`,
      undefined,
      { storeCookies }
    )
  }

  const topSearches = (): Promise<Suggestion> => {
    const params = new URLSearchParams({
      locale: ctx.storage.locale,
    })

    return fetchAPI(
      `${base}/_v/api/intelligent-search/top_searches?${params.toString()}`,
      undefined,
      { storeCookies }
    )
  }

  const facets = (args: Omit<SearchArgs, 'type'>) =>
    search<FacetSearchResult>({ ...args, type: 'facets' })

  return {
    facets,
    products,
    suggestedTerms,
    topSearches,

    // HEARST ECM SEARCH
    ecmProducts,
    ecmProductDetail,
    ecmFacets,
  }
}
