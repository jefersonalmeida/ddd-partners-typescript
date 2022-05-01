import ProductFactory from '../../../domain/product/factory/product.factory';
import {Sequelize} from 'sequelize-typescript';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/product.repository';
import UpdateProductUseCase from './update.product.use-case';

const product = ProductFactory.create('a', 'Product 1', 100);

const input = {
    id: product.id,
    name: 'Product 1 Updated',
    price: 200,
};

describe('Integration Test update product use case', () => {

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
        const useCase = new UpdateProductUseCase(productRepository);

        await productRepository.create(product);

        const result = await useCase.execute(input);

        expect(result).toEqual(input);
    });
});