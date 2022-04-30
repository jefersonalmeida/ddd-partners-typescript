import {Sequelize} from 'sequelize-typescript';
import {v4 as uuid} from 'uuid';
import CustomerModel from '../../customer/repository/sequelize/customer.model';
import OrderModel from './sequelize/order.model';
import ProductModel from '../../product/repository/sequelize/product.model';
import OrderItemModel from './sequelize/order-item.model';
import Customer from '../../../domain/customer/entity/customer';
import Address from '../../../domain/customer/value-object/address';
import CustomerRepository from '../../customer/repository/customer.repository';
import ProductRepository from '../../product/repository/product.repository';
import Product from '../../../domain/product/entity/product';
import OrderItem from '../../../domain/checkout/entity/order_item';
import Order from '../../../domain/checkout/entity/order';
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
        customer.changeAddress(new Address('Street 1', 1, 'zipcode', 'City'));
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
        customer.changeAddress(new Address('Street 1', 1, 'zipcode', 'City'));
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
        customer.changeAddress(new Address('Street 1', 1, 'zipcode', 'City'));
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
        customer.changeAddress(new Address('Street 1', 1, 'zipcode', 'City'));
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product1 = new Product(uuid(), 'Product 1', 100);
        await productRepository.create(product1);

        const orderItem1 = new OrderItem(uuid(), product1.id, product1.name, product1.price, 1);
        const order = new Order(uuid(), customer.id, [orderItem1]);

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
                    id: orderItem1.id,
                    orderId: order.id,
                    productId: orderItem1.productId,
                    name: orderItem1.name,
                    quantity: orderItem1.quantity,
                    price: orderItem1.price,
                },
            ],
        });

        const product2 = new Product(uuid(), 'Product 2', 150);
        await productRepository.create(product2);
        const orderItem2 = new OrderItem(uuid(), product2.id, product2.name, product2.price, 1);
        order.addItem(orderItem2);

        const product3 = new Product(uuid(), 'Product 3', 200);
        await productRepository.create(product3);
        const orderItem3 = new OrderItem(uuid(), product3.id, product3.name, product3.price, 5);
        order.addItem(orderItem3);

        order.removeItem(orderItem1);

        await orderRepository.update(order);

        const orderModel2 = await OrderModel.findOne({
            where: {id: order.id},
            include: ['items'],
        });

        expect(orderModel2.total).toEqual(order.total);
        expect(orderModel2.items.length).toEqual(order.items.length);
        expect(orderModel2.toJSON()).toStrictEqual({
            id: order.id,
            customerId: customer.id,
            total: order.total,
            items: [
                // {
                //     id: orderItem1.id,
                //     orderId: order.id,
                //     productId: orderItem1.productId,
                //     name: orderItem1.name,
                //     quantity: orderItem1.quantity,
                //     price: orderItem1.price,
                // },
                {
                    id: orderItem2.id,
                    orderId: order.id,
                    productId: orderItem2.productId,
                    name: orderItem2.name,
                    quantity: orderItem2.quantity,
                    price: orderItem2.price,
                },
                {
                    id: orderItem3.id,
                    orderId: order.id,
                    productId: orderItem3.productId,
                    name: orderItem3.name,
                    quantity: orderItem3.quantity,
                    price: orderItem3.price,
                },
            ],
        });
    });
});