import {Sequelize} from 'sequelize-typescript';
import FindProductUseCase from './find.product.use-case';
import ProductRepository from '../../../infrastructure/product/repository/product.repository';
import ProductFactory from '../../../domain/product/factory/product.factory';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';

describe('Integration find product use case', () => {

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

    it('should find a product', async () => {
        const productRepository = new ProductRepository();
        const useCase = new FindProductUseCase(productRepository);

        const product = ProductFactory.create('a', 'Product 1', 100);

        await productRepository.create(product);

        const input = {
            id: product.id,
        };

        const output = {
            id: product.id,
            name: product.name,
            price: product.price,
        };
        const result = await useCase.execute(input);

        expect(result).toEqual(output);
    });
});