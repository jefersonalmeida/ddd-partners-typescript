import FindProductUseCase from './find.product.use-case';
import ProductFactory from '../../../domain/product/factory/product.factory';

const product = ProductFactory.create('a', 'Product 1', 100);

const MockRepository = () => {
    return {
        findAll: jest.fn(),
        create: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn(),
    };
};

describe('Unit Test find product use case', () => {

    it('should find a product', async () => {
        const productRepository = MockRepository();
        const useCase = new FindProductUseCase(productRepository);

        const input = {id: product.id};
        const output = {
            id: product.id,
            name: product.name,
            price: product.price,
        };
        const result = await useCase.execute(input);

        expect(result).toEqual(output);
    });

    it('should not found a product', async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw Error('Product not found');
        });
        const useCase = new FindProductUseCase(productRepository);

        const input = {id: product.id};

        await expect(async () => {
            await useCase.execute(input);
        }).rejects.toThrow('Product not found');
    });
});