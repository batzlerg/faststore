import { Flex, useResponsiveSlider } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

import ShelfArrowLeft from './ArrowLeft'
import ShelfArrowRight from './ArrowRight'
import ShelfPage from './Page'
import ShelfPaginationDots from './PaginationDots'
import ShelfTitle from './Title'
import type { ProductSummary_ProductFragment } from '../ProductSummary/__generated__/ProductSummary_product.graphql'

type Product = Maybe<ProductSummary_ProductFragment>

export interface Props {
  products: Maybe<Product[]>
  pageSizes?: number[]
  title?: JSX.Element | string
  variant?: string
  showArrows: Maybe<boolean>
  showDots?: boolean
  autoplay?: number
}

const PAGE_SIZES = [1, 3, 5]

const Shelf: FC<Props> = ({
  products,
  title,
  variant = 'default',
  showArrows,
  showDots,
  autoplay,
  pageSizes = PAGE_SIZES,
}) => {
  const {
    page,
    items,
    totalPages,
    setPage,
    setNextPage,
    setPreviousPage,
    dragHandlers,
  } = useResponsiveSlider<Product>({
    pageSizes,
    defaultIndex: pageSizes.length - 1,
    allItems: products as Product[],
    autoplay,
  })

  showArrows =
    showArrows && products && products.length >= Math.max(...pageSizes)

  return (
    <>
      {title && <ShelfTitle variant={variant}>{title}</ShelfTitle>}
      <Flex {...dragHandlers}>
        {showArrows && (
          <ShelfArrowLeft variant={variant} onClick={() => setPreviousPage()} />
        )}
        <ShelfPage variant={variant} items={items} pageSizes={pageSizes} />
        {showArrows && (
          <ShelfArrowRight variant={variant} onClick={() => setNextPage()} />
        )}
      </Flex>
      {showDots && (
        <ShelfPaginationDots
          variant={variant}
          onSelect={setPage}
          selectedPage={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}

export default Shelf