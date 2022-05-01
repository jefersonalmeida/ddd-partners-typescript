import Notification from '../notification/notification';

export default abstract class Entity {

    protected _id: string;
    private readonly _notification: Notification;

    protected constructor() {
        this._notification = new Notification();
    }

    get id(): string {
        return this._id;
    }

    get notification(): Notification {
        return this._notification;
    }
}