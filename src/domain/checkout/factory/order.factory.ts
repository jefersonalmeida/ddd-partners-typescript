import Order from '../entity/order';
import OrderItem from '../entity/order_item';
import {v4 as uuid} from 'uuid';

interface OrderFactoryProps {
    customerId: string;
    id: string;
    items: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
        id: string
    }[];
}

export default class OrderFactory {
    static create(props: OrderFactoryProps): Order {
        const items = props.items.map(i => new OrderItem(uuid(), i.productId, i.name, i.price, i.quantity));
        return new Order(props.id, props.customerId, items);
    }
}