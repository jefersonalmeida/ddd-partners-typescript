import EventHandlerInterface from '../../@shared/event.handler.interface';
import AddressChangedEvent from '../address-changed.event';

export default class SendConsoleLogHandler implements EventHandlerInterface {
    handle(event: AddressChangedEvent): void {
        console.log(`Endereço do cliente: ${event.data.id}, ${event.data.name} alterado para: ${event.data.address.toString()}`);
    }
}