import {toXML, XmlOptions} from 'jstoxml';
import {OutputListCustomerDto} from '../../../usecase/customer/list/list.customer.dto';

export default class CustomerPresenter {
    static toListXML(data: OutputListCustomerDto): string {

        const xmlOption: XmlOptions = {
            header: true,
            indent: ' ',
        };

        return toXML({
            customers: {
                customer: data.customers.map(c => ({
                    id: c.id,
                    name: c.name,
                    address: {
                        street: c.address.street,
                        number: c.address.number,
                        zip: c.address.zip,
                        city: c.address.city,
                    },
                })),
            },
        }, xmlOption);
    }
}