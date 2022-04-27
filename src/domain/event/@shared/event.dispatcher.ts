import EventDispatcherInterface from './event.dispatcher.interface';
import EventInterface from './event.interface';
import EventHandlerInterface from './event.handler.interface';

export default class EventDispatcher implements EventDispatcherInterface {
    private _eventHandlers: { [name: string]: EventHandlerInterface[] } = {};

    get getEventHandlers(): { [name: string]: EventHandlerInterface[] } {
        return this._eventHandlers;
    }

    notify(event: EventInterface): void {
        const name = event.constructor.name;
        if (this._eventHandlers[name]) {
            this._eventHandlers[name].forEach(e => e.handle(event));
        }
    }

    register(eventName: string, eventHandler: EventHandlerInterface): void {
        if (!this._eventHandlers[eventName]) {
            this._eventHandlers[eventName] = [];
        }
        this._eventHandlers[eventName].push(eventHandler);
    }

    unregister(eventName: string, eventHandler: EventHandlerInterface): void {
        if (this._eventHandlers[eventName]) {
            const index = this._eventHandlers[eventName].indexOf(eventHandler);
            if (index !== -1) {
                this._eventHandlers[eventName].splice(index, 1);
            }
        }
    }

    unregisterAll(): void {
        this._eventHandlers = {};
    }
}