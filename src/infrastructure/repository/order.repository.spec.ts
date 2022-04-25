import {Sequelize} from 'sequelize-typescript';
import CustomerModel from '../db/sequelize/model/customer.model';
import OrderModel from '../db/sequelize/model/order.model';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import ProductModel from '../db/sequelize/model/product.model';
import Customer from '../../domain/entity/customer';
import CustomerRepository from './customer.repository';
import Address from '../../domain/entity/address';
import {v4 as uuid} from 'uuid';
import ProductRepository from './product.repository';
import Product from '../../domain/entity/product';
import OrderItem from '../../domain/entity/order_item';
import Order from '../../domain/entity/order';
import OrderRepository from './order.repository';

describe('Order repository tests', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            // storage: ':memory',
            logging: false,
            sync: {force: true},
        });

        await sequelize.addModels([
            CustomerModel,
            ProductModel,
            OrderModel,
            OrderItemModel,
        ]);

        await sequelize.sync();

    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a new order', async () => {
        const customerRepository = new CustomerRepository();

        const customer = new Customer(uuid(), 'Customer 1');
        customer.addRewardPoints(100);
        customer.changeAddress(new Address('Street 1', 1, '78000000', 'City'));
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product(uuid(), 'Product 1', 100);
        await productRepository.create(product);

        const orderItem = new OrderItem(uuid(), product.id, product.name, product.price, 1);
        const order = new Order(uuid(), customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ['items'],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customerId: customer.id,
            total: order.total,
            items: [
                {
                    id: orderItem.id,
                    orderId: order.id,
                    productId: orderItem.productId,
                    name: orderItem.name,
                    quantity: orderItem.quantity,
                    price: orderItem.price,
                },
            ],
        });
    });


    it('should find a order', async () => {
        const customerRepository = new CustomerRepository();

        const customer = new Customer(uuid(), 'Customer 1');
        customer.addRewardPoints(100);
        customer.changeAddress(new Address('Street 1', 1, '78000000', 'City'));
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product(uuid(), 'Product 1', 100);
        await productRepository.create(product);

        const orderItem = new OrderItem(uuid(), product.id, product.name, product.price, 1);
        const order = new Order(uuid(), customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ['items'],
        });

        const foundOrder = await orderRepository.find(order.id);

        expect(orderModel.toJSON()).toStrictEqual({
            id: foundOrder.id,
            customerId: foundOrder.customerId,
            total: foundOrder.total,
            items: foundOrder.items.map(i => ({
                id: i.id,
                orderId: foundOrder.id,
                productId: i.productId,
                name: i.name,
                quantity: i.quantity,
                price: i.price,
            })),
        });
    });

    it('should throw an error when customer is not found', async () => {
        const orderRepository = new OrderRepository();

        await expect(async () => {
            await orderRepository.find('123456');
        }).rejects.toThrow('Order not found');
    });

    it('should find all customers', async () => {
        const customerRepository = new CustomerRepository();

        const customer = new Customer(uuid(), 'Customer 1');
        customer.addRewardPoints(100);
        customer.changeAddress(new Address('Street 1', 1, '78000000', 'City'));
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product(uuid(), 'Product 1', 100);
        await productRepository.create(product);

        const orderItem1 = new OrderItem(uuid(), product.id, product.name, product.price, 1);
        const order1 = new Order(uuid(), customer.id, [orderItem1]);

        const orderItem2 = new OrderItem(uuid(), product.id, product.name, product.price, 1);
        const order2 = new Order(uuid(), customer.id, [orderItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const orders = [order1, order2];

        const foundOrders = await orderRepository.findAll();

        expect(foundOrders).toEqual(orders);
        expect(foundOrders).toHaveLength(2);
        expect(foundOrders).toContainEqual(order1);
        expect(foundOrders).toContainEqual(order2);
    });

    it('should update a customer', async () => {
        const customerRepository = new CustomerRepository();

        const customer = new Customer(uuid(), 'Customer 1');
        customer.addRewardPoints(100);
        customer.changeAddress(new Address('Street 1', 1, '78000000', 'City'));
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product(uuid(), 'Product 1', 100);
        await productRepository.create(product);

        const orderItem = new OrderItem(uuid(), product.id, product.name, product.price, 1);
        const order = new Order(uuid(), customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        await expect(async () => {
            await orderRepository.update(order);
        }).rejects.toEqual(new Error('Order update not allowed'));
    });
});