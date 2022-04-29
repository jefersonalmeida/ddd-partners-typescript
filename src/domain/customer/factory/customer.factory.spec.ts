import CustomerFactory from './customer.factory';
import Address from '../value-object/address';

describe('Customer factory unit test', () => {

    it('should create a customer', () => {
        const entity = CustomerFactory.create('Jeferson');
        expect(entity.id).toBeDefined();
        expect(entity.name).toBe('Jeferson');
        expect(entity.address).toBeUndefined();
    });

    it('should create a customer with an address', () => {
        const address = new Address('Street 1', 123, '13330-250', 'São Paulo');
        const entity = CustomerFactory.createWithAddress('Jeferson', address);
        expect(entity.id).toBeDefined();
        expect(entity.name).toBe('Jeferson');
        expect(entity.address).toBe(address);
    });
});