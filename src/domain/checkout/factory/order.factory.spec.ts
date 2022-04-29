import {v4 as uuid} from 'uuid';
import OrderFactory from './order.factory';

describe('Order factory unit test', () => {

    it('should create an order', () => {
        const orderProps = {
            id: uuid(),
            customerId: uuid(),
            items: [
                {
                    id: uuid(),
                    productId: uuid(),
                    name: 'Product 1',
                    price: 100,
                    quantity: 1,
                },
            ],
        };
        const entity = OrderFactory.create(orderProps);
        expect(entity.id).toEqual(orderProps.id);
        expect(entity.customerId).toEqual(orderProps.customerId);
        expect(entity.items.length).toBe(1);
    });
});