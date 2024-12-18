import { getOfferingReturnability } from './offerings'

describe('getOfferingReturnability', () => {
  it('should return null when offerings is undefined', () => {
    expect(getOfferingReturnability(undefined)).toBeNull()
  })

  it('should return null when offerings is an empty array', () => {
    expect(getOfferingReturnability([])).toBeNull()
  })

  it('should return null when no offering has returnability type', () => {
    const offerings: any[] = [
      { price: 100, name: 'promotion', id: '1', type: 'other' },
    ]
    expect(getOfferingReturnability(offerings)).toBeNull()
  })

  it('should return the offering when there is a single returnability offering', () => {
    const offerings: any[] = [
      { price: 0, name: 'NON_RETURNABLE', id: '1', type: 'returnability' },
    ]
    expect(getOfferingReturnability(offerings)).toEqual(offerings[0].name)
  })

  it('should return the returnability offering when there are multiple offerings', () => {
    const offerings: any[] = [
      { price: 100, name: 'promotion', id: '1', type: 'other' },
      {
        price: 0,
        name: 'NON_RETURNABLE_24_HOURS_AFTER_DELIVERY',
        id: '2',
        type: 'returnability',
      },
      { price: 0, name: 'foobar', id: '3', type: 'other' },
    ]
    expect(getOfferingReturnability(offerings)).toEqual(offerings[1].name)
  })
})
