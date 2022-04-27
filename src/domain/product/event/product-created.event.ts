import EventInterface from '../../@shared/event/event.interface';

export default class ProductCreatedEvent implements EventInterface {
    data: any;
    occurredAt: Date;

    constructor(data: any) {
        this.occurredAt = new Date();
        this.data = data;
    }
}