import CustomerCreatedEvent from './customer-created.event';
import SendConsoleLog2Handler from './handler/send-console-log-2.handler';
import {v4 as uuid} from 'uuid';
import SendConsoleLog1Handler from './handler/send-console-log-1.handler';
import SendConsoleLogHandler from './handler/send-console-log.handler';
import AddressChangedEvent from './address-changed.event';
import EventDispatcher from '../../@shared/event/event.dispatcher';
import Customer from '../entity/customer';
import Address from '../value-object/address';

describe('Customer events tests', () => {

    it('should notify CustomerCreatedEvent event handler', () => {
        const eventDispatcher = new EventDispatcher();
        const sendConsoleLog1Handler = new SendConsoleLog1Handler();
        const sendConsoleLog2Handler = new SendConsoleLog2Handler();

        const spySendConsoleLog1EventHandler = jest.spyOn(sendConsoleLog1Handler, 'handle');
        const spySendConsoleLog2EventHandler = jest.spyOn(sendConsoleLog2Handler, 'handle');

        eventDispatcher.register('CustomerCreatedEvent', sendConsoleLog1Handler);
        eventDispatcher.register('CustomerCreatedEvent', sendConsoleLog2Handler);

        expect(eventDispatcher.getEventHandlers[`CustomerCreatedEvent`]).toBeDefined();
        expect(eventDispatcher.getEventHandlers[`CustomerCreatedEvent`].length).toBe(2);
        expect(eventDispatcher.getEventHandlers[`CustomerCreatedEvent`][0]).toMatchObject(sendConsoleLog1Handler);
        expect(eventDispatcher.getEventHandlers[`CustomerCreatedEvent`][1]).toMatchObject(sendConsoleLog2Handler);

        const customer = new Customer(uuid(), 'Customer 1');

        const customerCreatedEvent = new CustomerCreatedEvent(customer);

        // quando o notify for executado o SendConsoleLog1Handler.handle() e SendConsoleLog2Handler.handle() deve ser chamado
        eventDispatcher.notify(customerCreatedEvent);

        expect(spySendConsoleLog1EventHandler).toHaveBeenCalled();
        expect(spySendConsoleLog2EventHandler).toHaveBeenCalled();
    });

    it('should notify AddressChangedEvent event handler', () => {
        const eventDispatcher = new EventDispatcher();
        const sendConsoleLogHandler = new SendConsoleLogHandler();

        const spySendConsoleLogEventHandler = jest.spyOn(sendConsoleLogHandler, 'handle');

        eventDispatcher.register('AddressChangedEvent', sendConsoleLogHandler);

        expect(eventDispatcher.getEventHandlers[`AddressChangedEvent`]).toBeDefined();
        expect(eventDispatcher.getEventHandlers[`AddressChangedEvent`].length).toBe(1);
        expect(eventDispatcher.getEventHandlers[`AddressChangedEvent`][0]).toMatchObject(sendConsoleLogHandler);

        const customer = new Customer(uuid(), 'Customer 1');
        customer.changeAddress(new Address('Street 1', 123, '13330-250', 'São Paulo'));

        const addressChangedEvent = new AddressChangedEvent(customer);
        // quando o notify for executado o SendConsoleLogHandler.handle() deve ser chamado
        eventDispatcher.notify(addressChangedEvent);

        expect(spySendConsoleLogEventHandler).toHaveBeenCalled();
    });
});