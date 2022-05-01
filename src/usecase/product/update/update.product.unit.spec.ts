import UpdateProductUseCase from './update.product.use-case';
import ProductFactory from '../../../domain/product/factory/product.factory';

const product = ProductFactory.create('a', 'Product 1', 100);

const input = {
    id: product.id,
    name: 'Product 1 Updated',
    price: 200,
};

const MockRepository = () => {
    return {
        findAll: jest.fn(),
        create: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn(),
    };
};

describe('Unit Test update product use case', () => {

    it('should create a product', async () => {
        const ProductRepository = MockRepository();
        const useCase = new UpdateProductUseCase(ProductRepository);

        const result = await useCase.execute(input);

        expect(result).toEqual(input);
    });
});