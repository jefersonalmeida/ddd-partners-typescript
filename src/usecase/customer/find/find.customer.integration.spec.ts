import {Sequelize} from 'sequelize-typescript';
import CustomerModel from '../../../infrastructure/customer/repository/sequelize/customer.model';
import CustomerRepository from '../../../infrastructure/customer/repository/customer.repository';
import Address from '../../../domain/customer/value-object/address';
import FindCustomerUseCase from './find.customer.use-case';
import CustomerFactory from '../../../domain/customer/factory/customer.factory';

describe('Integration find customer use case', () => {

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

    it('should find a customer', async () => {
        const customerRepository = new CustomerRepository();
        const useCase = new FindCustomerUseCase(customerRepository);

        const customer = CustomerFactory.createWithAddress(
            'Customer 1',
            new Address('Street 1', 1, '78000000', 'City'),
        );

        await customerRepository.create(customer);

        const input = {
            id: customer.id,
        };

        const output = {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.address.street,
                number: customer.address.number,
                zip: customer.address.zip,
                city: customer.address.city,
            },
        };
        const result = await useCase.execute(input);

        expect(result).toEqual(output);
    });
});