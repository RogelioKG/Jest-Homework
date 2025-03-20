import { WordPuritySystem } from './WordPuritySystem';
import { WordPurityService } from '@externals/word-purity';
import { BookInfo } from '@externals/simple-db';

jest.mock('@externals/word-purity');

describe('WordPuritySystem', () => {
    let wordPurityServiceMock: jest.Mocked<WordPurityService>;
    let system: WordPuritySystem;

    beforeEach(() => {
        wordPurityServiceMock = new WordPurityService() as jest.Mocked<WordPurityService>;
        wordPurityServiceMock.addWord.mockImplementation();
        wordPurityServiceMock.purity.mockImplementation((input: string) => {
            return input.replace(/is/gi, '**');
        });
        system = new WordPuritySystem(wordPurityServiceMock);
    });

    describe('constructor', () => {
        it('should add defalut words to the WordPurityService', () => {
            // Then
            expect(wordPurityServiceMock.addWord).toHaveBeenCalledWith(['Copperfield', 'Wonderland']);
        });
    });
    
    describe('setDisablePurity', () => {
        it('should disable the purity service', () => {
            // When
            system.setDisablePurity(true);
            // Then
            expect(system.isDisablePurity()).toBeTruthy();
        });
    });
    
    describe('purityItems', () => {
        let bookItems: BookInfo[];
        let expectedItems: BookInfo[];
        
        beforeAll(() => {
            // 過濾前
            bookItems = [
                { title: 'This is test 1', author: 'RogelioKG', ISBN: '111-11-11111-11-1' },
                { title: 'This is test 2', author: 'RogelioKG', ISBN: '222-22-22222-22-2' },
            ];
            // 過濾後
            expectedItems = [
                { title: 'Th** ** test 1', author: 'RogelioKG', ISBN: '111-11-11111-11-1' },
                { title: 'Th** ** test 2', author: 'RogelioKG', ISBN: '222-22-22222-22-2' },
            ];
        });
        
        it('should return the original items when purity is disabled', async () => {
            // When
            system.setDisablePurity(true);
            await system.process(bookItems);
            // Then
            expect(system.getItems()).toStrictEqual(bookItems);
        });
        
        it('should replace sensitive words in book titles when purity is enabled', async () => {
            // When
            system.setDisablePurity(false);
            await system.process(bookItems);
            // Then
            expect(system.getItems()).toStrictEqual(expectedItems);
        });
        
        it('should call purity method for each book item when processing', async () => {
            // When
            system.setDisablePurity(false);
            await system.process(bookItems);
            // Then
            expect(wordPurityServiceMock.purity).toHaveBeenCalledTimes(bookItems.length);
            expect(wordPurityServiceMock.purity).toHaveBeenCalledWith(bookItems[0].title);
            expect(wordPurityServiceMock.purity).toHaveBeenCalledWith(bookItems[1].title);
        });
        
        it('should not call purity when the service is disabled', async () => {
            // When
            system.setDisablePurity(true);
            await system.process(bookItems);
            // Then
            expect(wordPurityServiceMock.purity).not.toHaveBeenCalled();
        });
    });
});
