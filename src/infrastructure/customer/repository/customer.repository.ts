import CustomerRepositoryInterface from '../../../domain/customer/repository/customer.repository.interface';
import Customer from '../../../domain/customer/entity/customer';
import CustomerModel from './sequelize/customer.model';
import Address from '../../../domain/customer/value-object/address';

export default class CustomerRepository implements CustomerRepositoryInterface {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
            street: entity.address.street,
            number: entity.address.number,
            zipCode: entity.address.zip,
            city: entity.address.city,
        });
    }

    async find(id: string): Promise<Customer> {
        let found;
        try {
            found = await CustomerModel.findOne({where: {id}, rejectOnEmpty: true});
        } catch (error) {
            throw new Error('Customer not found');
        }

        const model = new Customer(id, found.name);
        model.addRewardPoints(found.rewardPoints);
        model.changeAddress(new Address(found.street, found.number, found.zipCode, found.city));
        if(found.active) {
            model.activate();
        }
        return model;
    }

    async findAll(): Promise<Customer[]> {
        const models = await CustomerModel.findAll();
        return models.map(p => {
            const model = new Customer(p.id, p.name);
            model.addRewardPoints(p.rewardPoints);
            model.changeAddress(new Address(p.street, p.number, p.zipCode, p.city));
            if(p.active) {
                model.activate();
            }
            return model;
        });
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update({
                name: entity.name,
                active: entity.isActive(),
                rewardPoints: entity.rewardPoints,
                street: entity.address.street,
                number: entity.address.number,
                zipCode: entity.address.zip,
                city: entity.address.city,
            },
            {
                where: {
                    id: entity.id,
                },
            },
        );
    }
}