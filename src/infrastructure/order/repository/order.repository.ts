import OrderRepositoryInterface from '../../../domain/checkout/repository/order.repository.interface';
import Order from '../../../domain/checkout/entity/order';
import OrderModel from './sequelize/order.model';
import OrderItemModel from './sequelize/order-item.model';
import OrderItem from '../../../domain/checkout/entity/order_item';

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

        await OrderItemModel.destroy({where: {orderId: entity.id}});
        for (const i of entity.items) {
            await OrderItemModel.create({
                id: i.id,
                orderId: entity.id,
                productId: i.productId,
                name: i.name,
                quantity: i.quantity,
                price: i.price,
            });
        }

        await OrderModel.update({
                id: entity.id,
                customerId: entity.customerId,
                total: entity.total,
            },
            {
                where: {
                    id: entity.id,
                },
            },
        );
    }
}