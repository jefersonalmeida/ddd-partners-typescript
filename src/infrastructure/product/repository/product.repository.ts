import ProductRepositoryInterface from '../../../domain/product/repository/product.repository.interface';
import Product from '../../../domain/product/entity/product';
import ProductModel from './sequelize/product.model';
import ProductInterface from '../../../domain/product/entity/product.interface';

export default class ProductRepository implements ProductRepositoryInterface {
    async create(entity: ProductInterface): Promise<void> {
        await ProductModel.create({
            id: entity.id,
            name: entity.name,
            price: entity.price,
        });
    }

    async find(id: string): Promise<Product> {
        const product = await ProductModel.findOne({where: {id}});
        return new Product(
            product.id,
            product.name,
            product.price,
        );
    }

    async findAll(): Promise<Product[]> {
        const products = await ProductModel.findAll();
        return products.map(p => new Product(
            p.id,
            p.name,
            p.price,
        ));
    }

    async update(entity: ProductInterface): Promise<void> {
        await ProductModel.update({
                name: entity.name,
                price: entity.price,
            },
            {
                where: {
                    id: entity.id,
                },
            },
        );
    }
}