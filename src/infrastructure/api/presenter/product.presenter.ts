import {toXML, XmlOptions} from 'jstoxml';
import {OutputListProductDto} from '../../../usecase/product/list/list.product.dto';

export default class ProductPresenter {
    static toListXML(data: OutputListProductDto): string {

        const xmlOption: XmlOptions = {
            header: true,
            indent: ' ',
        };

        return toXML({
            products: {
                product: data.products.map(c => ({
                    id: c.id,
                    name: c.name,
                    price: c.price,
                })),
            },
        }, xmlOption);
    }
}