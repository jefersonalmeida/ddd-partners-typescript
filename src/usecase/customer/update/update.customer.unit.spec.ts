import CustomerFactory from '../../../domain/customer/factory/customer.factory';
import Address from '../../../domain/customer/value-object/address';
import UpdateCustomerUseCase from './update.customer.use-case';

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

const MockRepository = () => {
    return {
        findAll: jest.fn(),
        create: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        update: jest.fn(),
    };
};

describe('Unit Test update customer use case', () => {

    it('should create a customer', async () => {
        const customerRepository = MockRepository();
        const useCase = new UpdateCustomerUseCase(customerRepository);

        const result = await useCase.execute(input);

        expect(result).toEqual(input);
    });
});