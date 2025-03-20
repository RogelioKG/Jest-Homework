import { BookInfo } from '@externals/simple-db';
import { BaseSystem } from './BaseSystem';

// 抽象類別沒辦法創建 instance，因此我們需要做一個最基本的子類別
class SimpleDerivedSystem extends BaseSystem {
    public process(prevItems: BookInfo[]): void {
        /* Do nothing */
    }
}

describe('BaseSystem', () => {
    const updateMessageStub = 'some update messages';
    let system: SimpleDerivedSystem;

    beforeEach(() => {
        system = new SimpleDerivedSystem(updateMessageStub);
    });

    describe('getItems', () => {
        it('should initialize with an empty items array', () => {
            // Then
            expect(system.getItems()).toStrictEqual([]);
        });
    });
    
    describe('getUpdateMessage', () => {
        it('should return the correct update message', () => {
            // Then
            expect(system.getUpdateMessage()).toBe(updateMessageStub);
        });
    });
});
