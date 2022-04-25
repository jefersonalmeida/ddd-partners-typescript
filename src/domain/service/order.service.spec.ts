import Customer from '../entity/customer';
import Order from '../entity/order';
import OrderItem from '../entity/order_item';
import OrderService from './order.service';
import {v4 as uuid} from 'uuid';

describe('Order service unit tests', () => {

    it('should place an order', () => {

        const customer = new Customer(uuid(), 'Customer 1');

        const item1 = new OrderItem(uuid(), uuid(), 'Item 1', 100, 1);
        const item2 = new OrderItem(uuid(), uuid(), 'Item 2', 200, 2);

        const order = new Order(uuid(), customer.id, [item1, item2]);

        OrderService.placeOrder(customer, [order]);

        expect(customer.rewardPoints).toBe(250);
        expect(order.total).toBe(500);
    });

    it('should get total of all orders', () => {

        const item1 = new OrderItem(uuid(), uuid(), 'Item 1', 100, 1);
        const item2 = new OrderItem(uuid(), uuid(), 'Item 2', 200, 2);

        const order1 = new Order(uuid(), uuid(), [item1]);
        const order2 = new Order(uuid(), uuid(), [item2]);

        const total = OrderService.total([order1, order2]);

        expect(total).toBe(500);

    });
});