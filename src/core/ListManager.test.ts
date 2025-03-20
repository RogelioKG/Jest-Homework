import { ListViewerManager, UpdateType } from './ListManager';
import { BaseSystem } from './BaseSystem';
import { DataBaseSystem } from './DataBaseSystem';
import { BookInfo } from '@externals/simple-db';

// non DI
jest.mock('@externals/word-purity');
jest.mock('@externals/simple-db');
jest.mock('./DataBaseSystem');
jest.mock('./WordPuritySystem');
jest.mock('./FilterSystem');
jest.mock('./SortSystem');
jest.mock('./DisplayRangeSystem');

describe('ListViewerManager', () => {
    let manager: ListViewerManager;

    beforeEach(async () => {
        jest.resetAllMocks();
        manager = new ListViewerManager();
        await manager.setUp();
    });

    describe('setUp', () => {
        it('should try to connect to db', async () => {
            expect(DataBaseSystem.prototype.connectDB).toBeCalledTimes(1);
        });
    });

    describe('updateResult', () => {
        const expectedUpdateTypes: string[] = (function <T extends object>(e: T) {
            const keys = Object.keys(e);
            const isStringEnum = isNaN(Number(keys[0]));
            return isStringEnum ? keys : keys.slice(keys.length / 2);
        })(UpdateType);
        const processorsLength = 5;
        const updateTypes: number[] = Array.from({ length: processorsLength }, (_, i) => i);
        let processors: BaseSystem[];

        beforeEach(() => {
            // Given
            processors = Array.from({ length: processorsLength }, (_, i) => manager.getProcessor(i));
            processors.forEach((processor, i) => {
                processor.process = jest.fn();
                processor.getUpdateMessage = jest.fn().mockReturnValue(UpdateType[i]);
            });
        });

        it.each(updateTypes)('should update systems starting from the correct updateType (%i)', async (updateType: number) => {
            // When
            await manager.updateResult(updateType);
            // Then
            const start = updateType;
            const end = UpdateType.Range + 1;
            processors.slice(start, end).forEach(
                (processor) => expect(processor.process).toHaveBeenCalled(),
            );
            expect(manager.getUpdateMessage()).toStrictEqual(expectedUpdateTypes.slice(start, end));
        });
    });

    describe('generateDisplayItemRow', () => {
        it('should return formatted items from the last processor', () => {
            // Given
            const mockItems = [
                { ISBN: '123', title: 'Book 1', author: 'Author 1' },
                { ISBN: '456', title: 'Book 2', author: 'Author 2' },
            ];
            const lastProcessor = manager['processors'].at(-1);
            lastProcessor.getItems = jest.fn().mockReturnValue(mockItems);
            // When
            const result = manager.generateDisplayItemRow();
            // Then
            expect(result).toStrictEqual([
                { ISBN: '123', title: 'Book 1', author: 'Author 1' },
                { ISBN: '456', title: 'Book 2', author: 'Author 2' },
            ]);
            expect(lastProcessor.getItems).toHaveBeenCalledTimes(1);
        });

        it('should handle empty items array', () => {
            // Given
            const mockItems: BookInfo[] = [];
            const lastProcessor = manager['processors'].at(-1);
            lastProcessor.getItems = jest.fn().mockReturnValue(mockItems);
            // When
            const result = manager.generateDisplayItemRow();
            // Then
            expect(result).toStrictEqual([]);
            expect(lastProcessor.getItems).toHaveBeenCalledTimes(1);
        });
    });
});