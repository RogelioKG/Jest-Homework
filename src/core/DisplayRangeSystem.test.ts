import { DisplayRangeSystem } from './DisplayRangeSystem';
import { TestBookInfoStub } from '../__test__/TestingData';

describe('DisplayRangeSystem', () => {
    let system: DisplayRangeSystem;

    beforeEach(() => {
        system = new DisplayRangeSystem();
    });

    describe('getStartRange / getEndRange', () => {
        it('should have default startRange as 1 and endRange as 10', () => {
            // Then
            expect(system.getStartRange()).toBe(1);
            expect(system.getEndRange()).toBe(10);
        });
    });

    describe('setRange', () => {
        it('should set valid range', () => {
            // When
            system.setRange(2, 5);
            // Then
            expect(system.getStartRange()).toBe(2);
            expect(system.getEndRange()).toBe(5);
        });

        it('should set valid range with string inputs', () => {
            // When
            system.setRange('2', '5');
            // Then
            expect(system.getStartRange()).toBe(2);
            expect(system.getEndRange()).toBe(5);
        });

        it('should throw error when endRange is less than startRange', () => {
            // Then
            expect(() => system.setRange(5, 2)).toThrowError('End Range cannot less than Start Range');
        });

        it('should throw error when startRange is invalid (negative number)', () => {
            // Then
            expect(() => system.setRange(-1, 5)).toThrowError('Cannot be less than 0');
        });

        it('should throw error when endRange is invalid (non-integer)', () => {
            // Then
            expect(() => system.setRange(1, 5.5)).toThrowError('Invalid Float Input');
        });

        it('should throw error when input is an invalid string', () => {
            // Then
            expect(() => system.setRange('invalid', 5)).toThrowError('Invalid String Input');
        });
    });

    describe('process', () => {
        it('should process items correctly when startRange and endRange are set', async () => {
            // When
            system.setRange(2, 5);
            await system.process(TestBookInfoStub);
            // Then
            expect(system['items']).toStrictEqual([
                TestBookInfoStub[1],  // "Game of Thrones I"
                TestBookInfoStub[2],  // "Bone of fire"
                TestBookInfoStub[3],  // "To Kill a Mockingbird"
                TestBookInfoStub[4],  // "One Thousand and One Nights"
            ]);
        });

        it('should process items correctly when startRange is 1 and endRange is 3', async () => {
            // When
            system.setRange(1, 3);
            await system.process(TestBookInfoStub);
            // Then
            expect(system['items']).toStrictEqual([
                TestBookInfoStub[0],  // "The Lord of The Rings"
                TestBookInfoStub[1],  // "Game of Thrones I"
                TestBookInfoStub[2],  // "Bone of fire"
            ]);
        });
    });
});
