import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box } from '@vtex/store-ui'
import React, { useMemo } from 'react'
import type { FC } from 'react'

import { useNumberFormat } from '../../sdk/localization/useNumberFormat'
import { TranslateEstimate } from './TranslateEstimate'
import type { ShippingQueryQuery } from './hooks/__generated__/ShippingQuery.graphql'

type ShippingOptionProps = {
  id: string
  estimate: string
  price?: number | null
  variant: string
}

const ShippingOption: FC<ShippingOptionProps> = ({
  id,
  price,
  estimate,
  variant,
}) => {
  const format = useNumberFormat()
  const intl = useIntl()

  const freightPrice = useMemo(() => {
    if (price === 0) {
      return intl.formatMessage({ id: 'shipping.free' })
    }

    if (!price) {
      return '-'
    }

    return format.format(price / 100)
  }, [price, format, intl])

  return (
    <Box as="tr" variant={`${variant}.optionRow`}>
      <Box as="td" variant={`${variant}.idCell`}>
        <Box as="label" variant={`${variant}.idLabel`}>
          <input type="radio" name="shipping-option" />
          {id}
        </Box>
      </Box>
      <Box as="td" variant={`${variant}.estimateCell`}>
        <TranslateEstimate shippingEstimate={estimate} />
      </Box>
      <Box as="td" variant={`${variant}.priceCell`}>
        {freightPrice}
      </Box>
    </Box>
  )
}

type ShippingTableProps = {
  shipping: ShippingQueryQuery | null
  variant: string
}

const ShippingTable: FC<ShippingTableProps> = ({
  shipping,
  variant: tableVariant,
}) => {
  const intl = useIntl()

  if (!shipping?.vtex?.shippingSLA?.deliveryOptions?.length) {
    return null
  }

  return (
    <Box as="table" variant={tableVariant}>
      <Box as="thead" variant={`${tableVariant}.thead`}>
        <Box as="tr" variant={`${tableVariant}.thead.row`}>
          <Box as="th" variant={`${tableVariant}.thead.id`}>
            {intl.formatMessage({ id: 'shipping.label.id' })}
          </Box>
          <Box as="th" variant={`${tableVariant}.thead.estimate`}>
            {intl.formatMessage({ id: 'shipping.label.estimate' })}
          </Box>
          <Box as="th" variant={`${tableVariant}.thead.price`}>
            {intl.formatMessage({ id: 'shipping.label.price' })}
          </Box>
        </Box>
      </Box>
      <Box as="tbody" variant={`${tableVariant}.tbody`}>
        {shipping?.vtex.shippingSLA?.deliveryOptions?.map((option) => {
          if (!option?.estimate || !option.id) return null

          const shippingOptionProps = {
            id: option.id,
            price: option.price,
            estimate: option.estimate,
          }

          return (
            <ShippingOption
              variant={tableVariant}
              key={shippingOptionProps.id}
              {...shippingOptionProps}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default ShippingTable