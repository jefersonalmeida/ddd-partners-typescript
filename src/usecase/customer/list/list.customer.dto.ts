export interface InputListCustomerDto {
}


type Customer = {
    id: string;
    name: string;
    address: {
        street: string;
        number: number;
        zip: string;
        city: string;
    };
}

export interface OutputListCustomerDto {
    customers: Customer[],
}

export class OutputCustomerMapper {
    static toOutput(customers: Customer[]): OutputListCustomerDto {
        return {
            customers: customers.map(c => ({
                id: c.id,
                name: c.name,
                address: {
                    street: c.address.street,
                    number: c.address.number,
                    zip: c.address.zip,
                    city: c.address.city,
                },
            })),
        };
    }
}