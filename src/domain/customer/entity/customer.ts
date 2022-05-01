import Address from '../value-object/address';
import Entity from '../../@shared/entity/entity.abstract';
import NotificationError from '../../@shared/notification/notification.error';
import CustomerValidatorFactory from '../factory/customer.validator.factory';

export default class Customer extends Entity {

    private _name: string = '';
    private _address?: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        super();
        this._id = id;
        this._name = name;
        this.validate();
    }

    get name(): string {
        return this._name;
    }

    get address(): Address {
        return this._address;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    validate(): boolean {
        CustomerValidatorFactory.create().validate(this);
        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
        return true;
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(value: Address) {
        this._address = value;
    }

    isActive(): boolean {
        return this._active;
    }

    activate() {
        if (this._address === undefined) {
            throw new Error('Address is mandatory to activate a customer');
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }
}