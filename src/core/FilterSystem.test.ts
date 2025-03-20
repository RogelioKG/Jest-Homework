import { FilterSystem } from './FilterSystem';
import { TestBookInfoStub } from '../__test__/TestingData';

describe('FilterSystem', () => {
    let system: FilterSystem;

    beforeEach(() => {
        system = new FilterSystem();
    });

    describe('setFilterWord', () => {
        it('should correctly set the word', () => {
            // When
            system.setFilterWord('fork');
            // Then
            expect(system.getFilterWord()).toBe('fork');
        });
    });

    describe('setIgnoreCase', () => {
        it('should correctly apply the case sensitivity strategy', () => {
            // When
            system.setIgnoreCase(true);
            // Then
            expect(system.isIgnoreCase()).toBeTruthy();
        });
    });
    
    describe('process', () => {
        it('should return books with titles containing the specified word (case-sensitive match)', async () => {
            // When
            system.setFilterWord('Game');
            system.setIgnoreCase(true);
            await system.process(TestBookInfoStub);
            // Then
            expect(system.getItems().every((val) => val.title.includes('Game'))).toBeTruthy();
        });
        it('should return books with titles containing the specified word (case-insensitive match)', async () => {
            // When
            system.setFilterWord('game');
            system.setIgnoreCase(false);
            await system.process(TestBookInfoStub);
            // Then
            expect(system.getItems().every((val) => /GaMe/i.test(val.title))).toBeTruthy();
        });
    });

});