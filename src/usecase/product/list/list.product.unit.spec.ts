import ProductFactory from '../../../domain/product/factory/product.factory';
import ListProductUseCase from './list.product.use-case';

const product1 = ProductFactory.create('a', 'Product 1', 100);
const product2 = ProductFactory.create('a', 'Product 2', 150);

const input = {};

const MockRepository = () => {
    return {
        findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
        create: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
    };
};

describe('Unit Test for listing product use case', () => {

    it('should list a product', async () => {
        const productRepository = MockRepository();
        const useCase = new ListProductUseCase(productRepository);

        const result = await useCase.execute(input);

        expect(result.products.length).toBe(2);

        expect(result.products[0].id).toBe(product1.id);
        expect(result.products[0].name).toBe(product1.name);
        expect(result.products[0].price).toBe(product1.price);

        expect(result.products[1].id).toBe(product2.id);
        expect(result.products[1].name).toBe(product2.name);
        expect(result.products[1].price).toBe(product2.price);
    });
});