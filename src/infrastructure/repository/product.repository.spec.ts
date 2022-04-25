import {Sequelize} from 'sequelize-typescript';
import ProductModel from '../db/sequelize/model/product.model';
import Product from '../../domain/entity/product';
import {v4 as uuid} from 'uuid';
import ProductRepository from './product.repository';

describe('Product repository tests', () => {
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
        const id = uuid();
        const product = new Product(id, 'Product 1', 100);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({where: {id}});

        expect(productModel.toJSON()).toStrictEqual({
            id,
            name: 'Product 1',
            price: 100,
        });
    });

    it('should find a product', async () => {
        const productRepository = new ProductRepository();
        const id = uuid();
        const product = new Product(id, 'Product 1', 100);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({where: {id}});

        const foundProduct = await productRepository.find(id);

        expect(productModel.toJSON()).toStrictEqual({
            id: foundProduct.id,
            name: foundProduct.name,
            price: foundProduct.price,
        });
    });

    it('should find all products', async () => {
        const productRepository = new ProductRepository();

        const product1 = new Product(uuid(), 'Product 1', 100);
        const product2 = new Product(uuid(), 'Product 2', 200);

        await productRepository.create(product1);
        await productRepository.create(product2);

        const foundProducts = await productRepository.findAll();

        expect(foundProducts).toEqual([product1, product2]);
        expect(foundProducts).toHaveLength(2);
        expect(foundProducts).toContainEqual(product1);
        expect(foundProducts).toContainEqual(product2);
    });

    it('should update a product', async () => {
        const productRepository = new ProductRepository();
        const id = uuid();
        const product = new Product(id, 'Product 1', 100);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({where: {id}});

        expect(productModel.toJSON()).toStrictEqual({
            id,
            name: 'Product 1',
            price: 100,
        });

        product.changeName('Product 1 updated');
        product.changePrice(200);

        await productRepository.update(product);

        const productModelUpdated = await ProductModel.findOne({where: {id}});

        expect(productModelUpdated.toJSON()).toStrictEqual({
            id,
            name: 'Product 1 updated',
            price: 200,
        });
    });
});