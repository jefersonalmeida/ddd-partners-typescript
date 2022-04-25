import Order from '../../domain/entity/order';
import OrderModel from '../db/sequelize/model/order.model';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderRepositoryInterface from '../../domain/repository/order.repository.interface';
import OrderItem from '../../domain/entity/order_item';

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customerId: entity.customerId,
            total: entity.total,
            items: entity.items.map(i => ({
                id: i.id,
                productId: i.productId,
                name: i.name,
                quantity: i.quantity,
                price: i.price,
            })),
        }, {
            include: [
                {model: OrderItemModel},
            ],
        });
    }

    async find(id: string): Promise<Order> {
        let found;
        try {
            found = await OrderModel.findOne({
                where: {id},
                include: [
                    {model: OrderItemModel},
                ],
                rejectOnEmpty: true,
            });
        } catch (error) {
            throw new Error('Order not found');
        }

        return new Order(
            id,
            found.customerId,
            found.items.map(i =>
                new OrderItem(
                    i.id,
                    i.productId,
                    i.name,
                    i.price,
                    i.quantity,
                ),
            ),
        );
    }

    async findAll(): Promise<Order[]> {
        const models = await OrderModel.findAll({
            include: [
                {model: OrderItemModel},
            ],
        });
        return models.map(p => new Order(
            p.id,
            p.customerId,
            p.items.map(i =>
                new OrderItem(
                    i.id,
                    i.productId,
                    i.name,
                    i.price,
                    i.quantity,
                ),
            ),
        ));
    }

    async update(entity: Order): Promise<void> {
        // return Promise.reject('Order update not allowed');
        throw new Error('Order update not allowed');
    }
}