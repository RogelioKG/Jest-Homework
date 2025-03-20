import { HashGenerator } from './HashGenerator';

describe('HashGenerator', () => {
    let generator: HashGenerator;

    beforeAll(() => {
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    beforeEach(() => {
        generator = new HashGenerator();
    });

    describe('g', () => {
        it('should generate an uppercase string of the specified length', () => {
            // Given
            const length = 10;
            // When
            const result = generator.g(length);
            // Then
            expect(result).toHaveLength(length);
            expect(result).toBe('NNNNNNNNNN'); // 在 random() mock 只回傳 0.5 的情況下，字元只能為 N
        });

        it('should throw an error when length is less than or equal to 0', () => {
            // Then
            expect(() => generator.g(0)).toThrow("Hash number can't less than 0");
            expect(() => generator.g(-5)).toThrow("Hash number can't less than 0");
        });
    });

    describe('simpleISBN', () => {
        it("should generate an ISBN-like string following the pattern '00-00-000'", () => {
            // Given
            const pattern = '00-00-000';
            // When
            const result = generator.simpleISBN(pattern);
            // Then
            expect(result).toHaveLength(pattern.length);
            expect(result).toBe('55-55-555'); // 在 random() mock 只回傳 0.5 的情況下，數字只能為 5
        });

        it('should preserve dashes in the given pattern', () => {
            // Given
            const pattern = '000-0-00--';
            // When
            const result = generator.simpleISBN(pattern);
            // Then
            expect(result).toBe('555-5-55--');
        });
    });
});
