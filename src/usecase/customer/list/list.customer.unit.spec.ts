import CustomerFactory from '../../../domain/customer/factory/customer.factory';
import Address from '../../../domain/customer/value-object/address';
import ListCustomerUseCase from './list.customer.use-case';

const customer1 = CustomerFactory.createWithAddress(
    'Customer 1',
    new Address('Street 1', 1, 'zipcode', 'City'),
);
const customer2 = CustomerFactory.createWithAddress(
    'Customer 2',
    new Address('Street 2', 1, 'zipcode', 'City'),
);

const input = {};

const MockRepository = () => {
    return {
        findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
        create: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
    };
};

describe('Unit Test for listing customer use case', () => {

    it('should list a customer', async () => {
        const customerRepository = MockRepository();
        const useCase = new ListCustomerUseCase(customerRepository);

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