import Address from '../../../domain/customer/value-object/address';
import FindCustomerUseCase from './find.customer.use-case';
import CustomerFactory from '../../../domain/customer/factory/customer.factory';

const customer = CustomerFactory.createWithAddress(
    'Customer 1',
    new Address('Street 1', 1, 'zipcode', 'City'),
);

const MockRepository = () => {
    return {
        findAll: jest.fn(),
        create: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        update: jest.fn(),
    };
};

describe('Unit Test find customer use case', () => {

    it('should find a customer', async () => {
        const customerRepository = MockRepository();
        const useCase = new FindCustomerUseCase(customerRepository);

        const input = {id: customer.id};
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

    it('should not found a customer', async () => {
        const customerRepository = MockRepository();
        customerRepository.find.mockImplementation(() => {
            throw Error('Customer not found');
        });
        const useCase = new FindCustomerUseCase(customerRepository);

        const input = {id: customer.id};

        await expect(async () => {
            await useCase.execute(input);
        }).rejects.toThrow('Customer not found');
    });
});