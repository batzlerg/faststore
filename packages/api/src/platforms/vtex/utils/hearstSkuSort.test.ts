import { sortLetterSizes, sortNumericSizes } from './hearstSkuSort';
import { FormattedSkuVariant } from "./skuVariants";

const buildSkuVariants = (values: string[]): FormattedSkuVariant[] =>
  values.map(value => ({ alt: '', src: '', label: '', value }));

describe('sortLetterSizes', () => {
  it('should sort sizes correctly', () => {
    const inputValues = ['2X/3X', 'L/XL', 'S/M', 'XS', 'XXL', '3X', 'XXS', 'M', 'L'];
    const expectedValues = ['XXS', 'XS', 'S/M', 'M', 'L', 'L/XL', 'XXL', '2X/3X', '3X'];
    const input = buildSkuVariants(inputValues);
    const expectedOutput = buildSkuVariants(expectedValues);
    expect(input.sort(sortLetterSizes)).toEqual(expectedOutput);
  });

  it('should handle empty array', () => {
    const input: FormattedSkuVariant[] = [];
    const expectedOutput: FormattedSkuVariant[] = [];
    expect(input.sort(sortLetterSizes)).toEqual(expectedOutput);
  });

  it('should handle single size', () => {
    const inputValues = ['M'];
    const input = buildSkuVariants(inputValues);
    const expectedOutput = buildSkuVariants(inputValues);
    expect(input.sort(sortLetterSizes)).toEqual(expectedOutput);
  });

  it('should handle sizes with numeric prefixes', () => {
    const inputValues = ['2X', '3X', '1X'];
    const expectedValues = ['1X', '2X', '3X'];
    const input = buildSkuVariants(inputValues);
    const expectedOutput = buildSkuVariants(expectedValues);
    expect(input.sort(sortLetterSizes)).toEqual(expectedOutput);
  });

  it('should handle mixed sizes', () => {
    const inputValues = ['XS', 'XXL', 'S', '3XL', 'M', 'L', 'XL', 'XXS'];
    const expectedValues = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    const input = buildSkuVariants(inputValues);
    const expectedOutput = buildSkuVariants(expectedValues);
    expect(input.sort(sortLetterSizes)).toEqual(expectedOutput);
  });

  it('should handle ranges correctly', () => {
    const inputValues = ['S/M', 'L/XL', 'XXS/XS', '2X/3X'];
    const expectedValues = ['XXS/XS', 'S/M', 'L/XL', '2X/3X'];
    const input = buildSkuVariants(inputValues);
    const expectedOutput = buildSkuVariants(expectedValues);
    expect(input.sort(sortLetterSizes)).toEqual(expectedOutput);
  });
});

describe('sortNumericSizes', () => {
  it('should sort numeric sizes correctly', () => {
    const inputValues = ['10', '2', '1.5', '3'];
    const expectedValues = ['1.5', '2', '3', '10'];
    const input = buildSkuVariants(inputValues);
    const expectedOutput = buildSkuVariants(expectedValues);
    expect(input.sort(sortNumericSizes)).toEqual(expectedOutput);
  });

  it('should handle empty array', () => {
    const input: FormattedSkuVariant[] = [];
    const expectedOutput: FormattedSkuVariant[] = [];
    expect(input.sort(sortNumericSizes)).toEqual(expectedOutput);
  });

  it('should handle single size', () => {
    const inputValues = ['2'];
    const input = buildSkuVariants(inputValues);
    const expectedOutput = buildSkuVariants(inputValues);
    expect(input.sort(sortNumericSizes)).toEqual(expectedOutput);
  });

  it('should handle mixed numeric sizes', () => {
    const inputValues = ['2 US', '10 US', '11.5 US', '3 US'];
    const expectedValues = ['2 US', '3 US', '10 US', '11.5 US'];
    const input = buildSkuVariants(inputValues);
    const expectedOutput = buildSkuVariants(expectedValues);
    expect(input.sort(sortNumericSizes)).toEqual(expectedOutput);
  });
});
