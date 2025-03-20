import { BookDataBaseService } from '@externals/simple-db';
import { HashGenerator } from '../utils/HashGenerator';
import { DataBaseSystem } from './DataBaseSystem';
import { TestBookInfoStub } from '../__test__/TestingData';

jest.mock('@externals/simple-db');
jest.mock('../utils/HashGenerator');

describe('DataBaseSystem', () => {
    let dbMock: jest.Mocked<BookDataBaseService>;
    let hashMock: jest.Mocked<HashGenerator>;
    let system: DataBaseSystem;

    beforeEach(() => {
        // ! DataBaseSystem constructor 的分支 or 是和這裡同樣邏輯，所以不用測
        dbMock = new BookDataBaseService() as jest.Mocked<BookDataBaseService>;
        hashMock = new HashGenerator() as jest.Mocked<HashGenerator>;
        system = new DataBaseSystem(dbMock, hashMock);
    });

    describe('connectDB', () => {
        it('should successfully connect and fetch books', async () => {
            // When
            dbMock.setUp.mockResolvedValue('Success');
            dbMock.getBooks.mockResolvedValue([{ ISBN: '123', title: 'Test', author: 'Author' }]);
            // Then
            await expect(system.connectDB()).resolves.toBe('Success');
            expect(dbMock.setUp).toHaveBeenCalledWith('http://localhost', 4000);
            expect(system.getItems()).toStrictEqual([{ ISBN: '123', title: 'Test', author: 'Author' }]);
        });

        it('should retry on failure and throw an error after max retries', async () => {
            // When
            dbMock.setUp.mockRejectedValue(new Error('DB Error'));
            // Then
            await expect(system.connectDB()).rejects.toThrow('Cannnot connect to DB');
            expect(dbMock.setUp).toHaveBeenCalledTimes(DataBaseSystem.retryTimes);
        });
    });

    describe('addBook', () => {
        it('should add a book successfully', async () => {
            // When
            hashMock.simpleISBN.mockReturnValue('000-00-00000-00-0');
            dbMock.addBook.mockResolvedValue(undefined);
            await system.addBook('Book Title', 'Book Author');
            // Then
            expect(hashMock.simpleISBN).toHaveBeenCalledWith('000-00-00000-00-0');
            expect(dbMock.addBook).toHaveBeenCalledWith({
                ISBN: '000-00-00000-00-0',
                title: 'Book Title',
                author: 'Book Author',
            });
        });

        it('should throw an error when title or author is missing', async () => {
            // Then
            await expect(system.addBook('', 'Author')).rejects.toThrow('Add book failed'); // * weird try-except
            await expect(system.addBook('Title', '')).rejects.toThrow('Add book failed'); // * weird try-except
        });

        it("should catch errors and throw 'Add book failed'", async () => {
            // When
            dbMock.addBook.mockRejectedValue(undefined);
            // Then
            await expect(system.addBook('Book Title', 'Book Author')).rejects.toThrow('Add book failed');
        });
    });

    describe('deleteBook', () => {
        it('should delete a book successfully', async () => {
            // When
            dbMock.deleteBook.mockResolvedValue(undefined);
            await system.deleteBook('000-00-00000-00-0');
            // Then
            expect(dbMock.deleteBook).toHaveBeenCalledWith('000-00-00000-00-0');
        });

        it('should throw an error when ISBN is empty', async () => {
            // Then
            await expect(system.deleteBook('')).rejects.toThrow('Delete book failed'); // * weird try-except
        });

        it("should catch errors and throw 'Delete book failed'", async () => {
            // When
            dbMock.deleteBook.mockRejectedValue(undefined);
            // Then
            await expect(system.deleteBook('000-00-00000-00-0')).rejects.toThrow('Delete book failed');
        });
    });

    describe('process', () => {
        it('should update items with books from the database', async () => {
            // When
            dbMock.getBooks.mockResolvedValue(TestBookInfoStub);
            await system.process([]);
            // Then
            expect(system.getItems()).toStrictEqual(TestBookInfoStub);
        });

        it('should handle errors silently', async () => {
            // When
            dbMock.getBooks.mockRejectedValue(undefined);
            // Then
            await expect(system.process([])).resolves.not.toThrow();
        });
    });
});
