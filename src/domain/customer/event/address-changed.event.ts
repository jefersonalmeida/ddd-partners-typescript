import EventInterface from '../../@shared/event/event.interface';
import Customer from '../entity/customer';

export default class AddressChangedEvent implements EventInterface {
    data: any;
    occurredAt: Date;

    constructor(data: Customer) {
        this.occurredAt = new Date();
        this.data = data;
    }
}