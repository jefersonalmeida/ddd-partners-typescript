import {Sequelize} from 'sequelize-typescript';
import {v4 as uuid} from 'uuid';
import CustomerRepository from './customer.repository';
import CustomerModel from './sequelize/customer.model';
import Customer from '../../../domain/customer/entity/customer';
import Address from '../../../domain/customer/value-object/address';

describe('Customer repository tests', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            // storage: ':memory',
            logging: false,
            sync: {force: true},
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();

    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a customer', async () => {
        const customerRepository = new CustomerRepository();
        const id = uuid();
        const customer = new Customer(id, 'Customer 1');
        customer.addRewardPoints(100);
        customer.changeAddress(new Address('Street 1', 1, '78000000', 'City'));

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({where: {id}});

        expect(customerModel.toJSON()).toStrictEqual({
            id,
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: customer.address.street,
            number: customer.address.number,
            zipCode: customer.address.zip,
            city: customer.address.city,
        });
    });

    it('should find a customer', async () => {
        const customerRepository = new CustomerRepository();
        const id = uuid();
        const customer = new Customer(id, 'Customer 1');
        customer.addRewardPoints(10);
        customer.changeAddress(new Address('Street 1', 1, '78000000', 'City'));
        customer.activate();

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({where: {id}});

        const foundCustomer = await customerRepository.find(id);

        expect(customerModel.toJSON()).toStrictEqual({
            id: foundCustomer.id,
            name: foundCustomer.name,
            active: true,
            rewardPoints: foundCustomer.rewardPoints,
            street: foundCustomer.address.street,
            number: foundCustomer.address.number,
            zipCode: foundCustomer.address.zip,
            city: foundCustomer.address.city,
        });
    });

    it('should throw an error when customer is not found', async () => {
        const customerRepository = new CustomerRepository();

        await expect(async () => {
            await customerRepository.find('123456');
        }).rejects.toThrow('Customer not found');
    });

    it('should find all customers', async () => {
        const customerRepository = new CustomerRepository();

        const customer1 = new Customer(uuid(), 'Customer 1');
        customer1.addRewardPoints(10);
        customer1.changeAddress(new Address('Street 1', 1, '78000000', 'City'));

        const customer2 = new Customer(uuid(), 'Customer 2');
        customer2.addRewardPoints(30);
        customer2.changeAddress(new Address('Street 1', 1, '78000000', 'City'));
        customer2.activate();

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const customers = [customer1, customer2];

        const foundCustomers = await customerRepository.findAll();

        expect(foundCustomers).toEqual(customers);
        expect(foundCustomers).toHaveLength(2);
        expect(foundCustomers).toContainEqual(customer1);
        expect(foundCustomers).toContainEqual(customer2);
    });

    it('should update a customer', async () => {
        const customerRepository = new CustomerRepository();
        const id = uuid();
        const customer = new Customer(id, 'Customer 1');
        customer.changeAddress(new Address('Street 1', 1, '78000000', 'City'));

        await customerRepository.create(customer);

        customer.changeName('Customer 1 updated');

        await customerRepository.update(customer);

        const customerModelUpdated = await CustomerModel.findOne({where: {id}});

        expect(customerModelUpdated.toJSON()).toStrictEqual({
            id,
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: customer.address.street,
            number: customer.address.number,
            zipCode: customer.address.zip,
            city: customer.address.city,
        });
    });
});