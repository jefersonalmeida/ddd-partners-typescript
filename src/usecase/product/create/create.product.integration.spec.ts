import CreateProductUseCase from './create.product.use-case';
import {Sequelize} from 'sequelize-typescript';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/product.repository';

const input = {
    type: 'a',
    name: 'Product 1',
    price: 100,
};

describe('Integration Test create product use case', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            // storage: ':memory',
            logging: false,
            sync: {force: true},
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();

    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a product', async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);

        const result = await useCase.execute(input);

        const output = {
            id: expect.any(String),
            name: input.name,
            price: input.price,
        };

        expect(result).toEqual(output);
    });

    it('should thrown an error when name is missing', async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);

        input.name = '';

        await expect(async () => {
            await useCase.execute(input);
        }).rejects.toThrow('Name is required');
    });

    it('should thrown an error when price must be greater than zero', async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);

        input.name = 'Product 1';
        input.price = -1;

        await expect(async () => {
            await useCase.execute(input);
        }).rejects.toThrow('Price must be greater than zero');
    });
});