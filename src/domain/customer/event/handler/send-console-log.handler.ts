import AddressChangedEvent from '../address-changed.event';
import EventHandlerInterface from '../../../@shared/event/event.handler.interface';

export default class SendConsoleLogHandler implements EventHandlerInterface {
    handle(event: AddressChangedEvent): void {
        console.log(`Endereço do cliente: ${event.data.id}, ${event.data.name} alterado para: ${event.data.address.toString()}`);
    }
}