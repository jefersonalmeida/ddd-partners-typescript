import CreateCustomerUseCase from './create.customer.use-case';
import {Sequelize} from 'sequelize-typescript';
import CustomerModel from '../../../infrastructure/customer/repository/sequelize/customer.model';
import CustomerRepository from '../../../infrastructure/customer/repository/customer.repository';

const input = {
    name: 'Customer 1',
    address: {
        street: 'Street 1',
        number: 1,
        zip: 'zipcode',
        city: 'city',
    },
};

describe('Integration Test create customer use case', () => {

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
        const useCase = new CreateCustomerUseCase(customerRepository);

        const result = await useCase.execute(input);

        const output = {
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                number: input.address.number,
                zip: input.address.zip,
                city: input.address.city,
            },
        };

        expect(result).toEqual(output);
    });

    it('should thrown an error when name is missing', async () => {
        const customerRepository = new CustomerRepository();
        const useCase = new CreateCustomerUseCase(customerRepository);

        input.name = '';

        await expect(async () => {
            await useCase.execute(input);
        }).rejects.toThrow('Name is required');
    });

    it('should thrown an error when street is missing', async () => {
        const customerRepository = new CustomerRepository();
        const useCase = new CreateCustomerUseCase(customerRepository);

        input.address.street = '';

        await expect(async () => {
            await useCase.execute(input);
        }).rejects.toThrow('Street is required');
    });
});