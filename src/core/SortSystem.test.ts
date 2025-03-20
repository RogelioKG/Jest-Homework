import { SortSystem } from './SortSystem';
import { TestBookInfoStub } from '../__test__/TestingData';

describe('SortSystem', () => {
    let system: SortSystem;

    beforeEach(() => {
        system = new SortSystem();
    });

    describe('getSortType', () => {
        it('should have default sort type as ASC', () => {
            // Then
            expect(system.getSortType()).toBe(SortSystem.ASC);
        });
    });

    describe('setSortType', () => {
        it('should set sort type to ASC', () => {
            // When
            system.setSortType(SortSystem.ASC);
            // Then
            expect(system.getSortType()).toBe(SortSystem.ASC);
        });
        
        it('should set sort type to DESC', () => {
            // When
            system.setSortType(SortSystem.DESC);
            // Then
            expect(system.getSortType()).toBe(SortSystem.DESC);
        });
        
        it('should throw error for invalid sort type', () => {
            // Then
            expect(() => system.setSortType('INVALID')).toThrowError('It must be ASC or DESC');
        });
    });

    describe('process', () => {
        it('should sort items in ascending order when sort type is ASC', async () => {
            // When
            system.setSortType(SortSystem.ASC);
            await system.process(TestBookInfoStub);
            const books = system.getItems();
            // Then
            expect(books[0].title).toBe('Alice Adventures in Wonderland');
            expect(books[1].title).toBe('Bone of fire');
            expect(books[2].title).toBe('Emma Story');
            expect(books[3].title).toBe('Game of Thrones I');
            expect(books[4].title).toBe('Game of Thrones II');
            expect(books[5].title).toBe('One Thousand and One Nights');
            expect(books[6].title).toBe('The Lord of The Rings');
            expect(books[7].title).toBe('To Kill a Mockingbird');
        });
        
        it('should sort items in descending order when sort type is DESC', async () => {
            // When
            system.setSortType(SortSystem.DESC);
            await system.process(TestBookInfoStub);
            const books = system.getItems();
            // Then
            expect(books[0].title).toBe('To Kill a Mockingbird');
            expect(books[1].title).toBe('The Lord of The Rings');
            expect(books[2].title).toBe('One Thousand and One Nights');
            expect(books[3].title).toBe('Game of Thrones II');
            expect(books[4].title).toBe('Game of Thrones I');
            expect(books[5].title).toBe('Emma Story');
            expect(books[6].title).toBe('Bone of fire');
            expect(books[7].title).toBe('Alice Adventures in Wonderland');
        });
    });
});
