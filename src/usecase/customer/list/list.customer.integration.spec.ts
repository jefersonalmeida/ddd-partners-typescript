import CustomerFactory from '../../../domain/customer/factory/customer.factory';
import Address from '../../../domain/customer/value-object/address';
import ListCustomerUseCase from './list.customer.use-case';
import CustomerRepository from '../../../infrastructure/customer/repository/customer.repository';
import {Sequelize} from 'sequelize-typescript';
import CustomerModel from '../../../infrastructure/customer/repository/sequelize/customer.model';

const customer1 = CustomerFactory.createWithAddress(
    'Customer 1',
    new Address('Street 1', 1, 'zipcode', 'City'),
);
const customer2 = CustomerFactory.createWithAddress(
    'Customer 2',
    new Address('Street 2', 1, 'zipcode', 'City'),
);

const input = {};

describe('Integration Test for listing customer use case', () => {

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

    it('should list a customer', async () => {
        const customerRepository = new CustomerRepository();
        const useCase = new ListCustomerUseCase(customerRepository);

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const result = await useCase.execute(input);

        expect(result.customers.length).toBe(2);

        expect(result.customers[0].id).toBe(customer1.id);
        expect(result.customers[0].name).toBe(customer1.name);
        expect(result.customers[0].address.street).toBe(customer1.address.street);

        expect(result.customers[1].id).toBe(customer2.id);
        expect(result.customers[1].name).toBe(customer2.name);
        expect(result.customers[1].address.street).toBe(customer2.address.street);
    });
});