import Customer from '../entity/customer';
import Order from '../entity/order';

export default class OrderService {

    static placeOrder(customer: Customer, orders: Order[]): void {
        if (orders.length === 0) {
            throw new Error('Order must have at least one order');
        }
        customer.addRewardPoints(OrderService.total(orders) / 2);
    }

    static total(orders: Order[]): number {
        return orders.reduce((acc, order) => acc + order.total, 0);
    }
}