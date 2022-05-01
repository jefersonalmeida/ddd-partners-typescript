import express, {Request, Response} from 'express';
import CreateProductUseCase from '../../../usecase/product/create/create.product.use-case';
import ProductRepository from '../../product/repository/product.repository';
import ListProductUseCase from '../../../usecase/product/list/list.product.use-case';
import {InputCreateProductDto} from '../../../usecase/product/create/create.product.dto';

export const productRoute = express.Router();

productRoute.post('/', async (req: Request, res: Response) => {
    const useCase = new CreateProductUseCase(new ProductRepository());
    try {
        const dto: InputCreateProductDto = {
            type: req.body.type,
            name: req.body.name,
            price: req.body.price,
        };
        const output = await useCase.execute(dto);
        res.send(output);
    } catch (e) {
        res.status(500).send(e);
    }
});

productRoute.get('/', async (req: Request, res: Response) => {
    const useCase = new ListProductUseCase(new ProductRepository());
    try {
        const output = await useCase.execute({});
        res.send(output);
    } catch (e) {
        res.status(500).send(e);
    }
});