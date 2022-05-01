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
                    number: 2,
                    zip: 'zip 2',
                    city: 'city 2',
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
        expect(customer2.address.number).toBe(2);
        expect(customer2.address.zip).toBe('zip 2');
        expect(customer2.address.city).toBe('city 2');

        const listResponseXML = await request(app)
            .get('/customers')
            .set('Accept', 'application/xml')
            .send();

        expect(listResponseXML.status).toBe(200);
        expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
        expect(listResponseXML.text).toContain(`<customers>`);

        expect(listResponseXML.text).toContain(`<customer>`);
        expect(listResponseXML.text).toContain(`<name>Customer 1</name>`);
        expect(listResponseXML.text).toContain(`<address>`);
        expect(listResponseXML.text).toContain(`<street>Street 1</street>`);
        expect(listResponseXML.text).toContain(`<number>1</number>`);
        expect(listResponseXML.text).toContain(`<zip>zip</zip>`);
        expect(listResponseXML.text).toContain(`<city>city</city>`);
        expect(listResponseXML.text).toContain(`</address>`);
        expect(listResponseXML.text).toContain(`</customer>`);

        expect(listResponseXML.text).toContain(`<customer>`);
        expect(listResponseXML.text).toContain(`<name>Customer 2</name>`);
        expect(listResponseXML.text).toContain(`<address>`);
        expect(listResponseXML.text).toContain(`<street>Street 2</street>`);
        expect(listResponseXML.text).toContain(`<number>2</number>`);
        expect(listResponseXML.text).toContain(`<zip>zip 2</zip>`);
        expect(listResponseXML.text).toContain(`<city>city 2</city>`);
        expect(listResponseXML.text).toContain(`</address>`);
        expect(listResponseXML.text).toContain(`</customer>`);

        expect(listResponseXML.text).toContain(`</customers>`);
    });
});