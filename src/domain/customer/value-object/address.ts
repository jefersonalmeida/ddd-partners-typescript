export default class Address {

    private readonly _street: string = '';
    private readonly _number: number = 0;
    private readonly _zip: string = '';
    private readonly _city: string = '';

    constructor(street: string, addressNumber: number, zip: string, city: string) {

        this._street = street;
        this._number = addressNumber;
        this._zip = zip;
        this._city = city;

        this.validate();
    }

    validate() {
        if (this._street.length === 0) {
            throw new Error('Street is required');
        }
        if (this._number === 0) {
            throw new Error('Number is required');
        }
        if (this._zip.length === 0) {
            throw new Error('Zip is required');
        }
        if (this._city.length === 0) {
            throw new Error('City is required');
        }
    }

    get street(): string {
        return this._street;
    }

    get number(): number {
        return this._number;
    }

    get zip(): string {
        return this._zip;
    }

    get city(): string {
        return this._city;
    }

    toString() {
        return `${this._street}, ${this._number}, ${this._zip} ${this._city}`;
    }
}