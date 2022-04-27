import Order from './order';
import OrderItem from './order_item';
import {v4 as uuid} from 'uuid';

describe('Order unit tests', () => {
    it('should throw error when id is empty', () => {
        expect(() => {
            const order = new Order('', uuid(), []);
        }).toThrowError('Id is required');
    });

    it('should throw error when customerId is empty', () => {
        expect(() => {
            const order = new Order(uuid(), '', []);
        }).toThrowError('CustomerId is required');
    });

    it('should throw error when customerId is empty', () => {
        expect(() => {
            const order = new Order(uuid(), uuid(), []);
        }).toThrowError('Items are required');
    });

    it('should calculate total', () => {
        const item = new OrderItem(uuid(), uuid(), 'Item 1', 100, 2);
        const item2 = new OrderItem(uuid(), uuid(), 'Item 2', 200, 2);
        const order = new Order(uuid(), uuid(), [item]);

        let total = order.total;

        expect(total).toBe(200);

        const order2 = new Order(uuid(), uuid(), [item, item2]);
        total = order2.total;
        expect(total).toBe(600);
    });

    it('should throw error if the item qte is less or equal zero 0', () => {
        expect(() => {
            const item = new OrderItem(uuid(), uuid(), 'Item 1', 100, 0);
            const order = new Order(uuid(), uuid(), [item]);
        }).toThrowError('Quantity must be greater than 0');
    });
});
