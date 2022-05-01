import {app, sequelize} from '../express';
import request from 'supertest';

describe('E2E test for customer', () => {
    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should create a customer', async () => {
        const response = await request(app)
            .post('/customers')
            .send({
                name: 'Customer 1',
                address: {
                    street: 'Street 1',
                    number: 1,
                    zip: 'zip',
                    city: 'city',
                },
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Customer 1');
        expect(response.body.address.street).toBe('Street 1');
        expect(response.body.address.number).toBe(1);
        expect(response.body.address.zip).toBe('zip');
        expect(response.body.address.city).toBe('city');
    });

    it('should not create a customer', async () => {
        const response = await request(app)
            .post('/customers')
            .send({
                name: 'Customer 1',
            });

        expect(response.status).toBe(500);
    });

    it('should list all a customer', async () => {
        const response1 = await request(app)
            .post('/customers')
            .send({
                name: 'Customer 1',
                address: {
                    street: 'Street 1',
                    number: 1,
                    zip: 'zip',
                    city: 'city',
                },
            });

        expect(response1.status).toBe(200);

        const response2 = await request(app)
            .post('/customers')
            .send({
                name: 'Customer 2',
                address: {
                    street: 'Street 2',
                    number: 1,
                    zip: 'zip',
                    city: 'city',
                },
            });

        expect(response2.status).toBe(200);

        const listResponse = await request(app).get('/customers').send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(2);

        const customer1 = listResponse.body.customers[0];
        expect(customer1.name).toBe('Customer 1');
        expect(customer1.address.street).toBe('Street 1');
        expect(customer1.address.number).toBe(1);
        expect(customer1.address.zip).toBe('zip');
        expect(customer1.address.city).toBe('city');

        const customer2 = listResponse.body.customers[1];
        expect(customer2.name).toBe('Customer 2');
        expect(customer2.address.street).toBe('Street 2');
        expect(customer2.address.number).toBe(1);
        expect(customer2.address.zip).toBe('zip');
        expect(customer2.address.city).toBe('city');
    });
});