import express, {Request, Response} from 'express';
import CreateCustomerUseCase from '../../../usecase/customer/create/create.customer.use-case';
import CustomerRepository from '../../customer/repository/customer.repository';
import ListCustomerUseCase from '../../../usecase/customer/list/list.customer.use-case';
import {InputCreateCustomerDto} from '../../../usecase/customer/create/create.customer.dto';

export const customerRoute = express.Router();

customerRoute.post('/', async (req: Request, res: Response) => {
    const useCase = new CreateCustomerUseCase(new CustomerRepository());
    try {
        const dto: InputCreateCustomerDto = {
            name: req.body.name,
            address: {
                street: req.body.address.street,
                number: req.body.address.number,
                zip: req.body.address.zip,
                city: req.body.address.city,
            },
        };
        const output = await useCase.execute(dto);
        res.send(output);
    } catch (e) {
        res.status(500).send(e);
    }
});

customerRoute.get('/', async (req: Request, res: Response) => {
    const useCase = new ListCustomerUseCase(new CustomerRepository());
    try {
        const output = await useCase.execute({});
        res.send(output);
    } catch (e) {
        res.status(500).send(e);
    }
});