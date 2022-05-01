import Notification from './notification';

describe('Unit tests for notifications', () => {

    it('should create errors', () => {
        const notification = new Notification();
        const error1 = {
            message: 'error message 1',
            context: 'customer',
        };

        notification.addError(error1);

        expect(notification.getMessages('customer')).toBe('customer: error message 1');

        const error2 = {
            message: 'error message 2',
            context: 'customer',
        };

        notification.addError(error2);

        expect(
            notification.getMessages('customer'),
        ).toBe('customer: error message 1, customer: error message 2');

        const error3 = {
            message: 'error message 3',
            context: 'order',
        };

        notification.addError(error3);

        expect(
            notification.getMessages('order'),
        ).toBe('order: error message 3');


        expect(
            notification.getMessages(),
        ).toBe('customer: error message 1, customer: error message 2, order: error message 3');
    });

    it('should check if notification has at least one error', () => {
        const notification = new Notification();
        const error = {
            message: 'error message 1',
            context: 'customer',
        };

        notification.addError(error);

        expect(notification.hasErrors()).toBe(true);
    });

    it('should get all errors props', () => {
        const notification = new Notification();
        const error = {
            message: 'error message 1',
            context: 'customer',
        };

        notification.addError(error);

        expect(notification.getErrors()).toEqual([error]);
    });
});