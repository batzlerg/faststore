import type { Context } from '../index'

type CookieValue = string | null;

const getCookieFromContext = (ctx: Context): CookieValue => {
  const requestHeaders = new Headers(ctx.headers);
  return requestHeaders.get('cookie')
}

const getCookieValue = (cookieName: string, cookie: CookieValue) => {
  if (!cookie) return null
  const name = cookieName + '='
  const decodedCookie = decodeURIComponent(cookie)
  const cookieArray = decodedCookie.split(';')

  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim()
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length)
    }
  }

  return null
}

export const checkEcmSearchEnabled = (ctx: Context) => {
  const isEcmSearchConfigured = ctx.featureFlags?.ecmSearch
  if (!isEcmSearchConfigured) {
    return false
  }
  const cookie = getCookieFromContext(ctx)
  const isEcmSearchOverridden = getCookieValue('feature_flag_ecm_search_override', cookie) === 'true'
  return !isEcmSearchOverridden
}

export const checkSponsoredProductsEnabled = (ctx: Context) => {
  const { featureFlags } = ctx;
  const cookie = getCookieFromContext(ctx);
  const isOverridden = getCookieValue('feature_flag_rmn_override', cookie) === 'true'
  return featureFlags?.enableSponsoredProducts && !isOverridden;
}

export const checkSponsoredTestProductsEnabled = (ctx: Context) => {
  const cookie = getCookieFromContext(ctx);
  return  getCookieValue('feature_flag_rmn_enabled', cookie) === 'true'
}