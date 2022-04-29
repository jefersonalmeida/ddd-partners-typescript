import Customer from '../entity/customer';
import {v4 as uuid} from 'uuid';
import Address from '../value-object/address';

export default class CustomerFactory {
    public static create(name: string): Customer {
        return new Customer(uuid(), name);
    }

    static createWithAddress(name: string, address: Address): Customer {
        const entity = new Customer(uuid(), name);
        entity.changeAddress(address);
        return entity;
    }
}