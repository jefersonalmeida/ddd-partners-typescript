import CreateCustomerUseCase from './create.customer.use-case';

const input = {
    name: 'Customer 1',
    address: {
        street: 'Street 1',
        number: 1,
        zip: 'zipcode',
        city: 'city',
    },
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe('Unit Test create customer use case', () => {

    it('should create a customer', async () => {
        const customerRepository = MockRepository();
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
        const customerRepository = MockRepository();
        const useCase = new CreateCustomerUseCase(customerRepository);

        input.name = '';

        await expect(async () => {
            await useCase.execute(input);
        }).rejects.toThrow('Name is required');
    });

    it('should thrown an error when street is missing', async () => {
        const customerRepository = MockRepository();
        const useCase = new CreateCustomerUseCase(customerRepository);

        input.address.street = '';

        await expect(async () => {
            await useCase.execute(input);
        }).rejects.toThrow('Street is required');
    });
});