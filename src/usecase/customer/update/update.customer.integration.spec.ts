import CustomerFactory from '../../../domain/customer/factory/customer.factory';
import Address from '../../../domain/customer/value-object/address';
import UpdateCustomerUseCase from './update.customer.use-case';
import CustomerRepository from '../../../infrastructure/customer/repository/customer.repository';
import {Sequelize} from 'sequelize-typescript';
import CustomerModel from '../../../infrastructure/customer/repository/sequelize/customer.model';

const customer = CustomerFactory.createWithAddress(
    'Customer 1',
    new Address('Street 1', 1, 'zipcode', 'City'),
);

const input = {
    id: customer.id,
    name: 'Customer 1 Updated',
    address: {
        street: 'Street 1 Updated',
        number: 1234,
        zip: 'zipcode Updated',
        city: 'city Updated',
    },
};

describe('Integration Test update customer use case', () => {

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
        const useCase = new UpdateCustomerUseCase(customerRepository);

        await customerRepository.create(customer);

        const result = await useCase.execute(input);

        expect(result).toEqual(input);
    });
});