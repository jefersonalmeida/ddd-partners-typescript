import OrderItem from './order_item';

export default class Order {

    private readonly _id: string;
    private readonly _customerId: string;
    private _items: OrderItem[];

    constructor(id: string, customerId: string, items: OrderItem[]) {
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this.validate();
    }

    validate(): boolean {
        if (this._id.length === 0) {
            throw new Error('Id is required');
        }
        if (this._customerId.length === 0) {
            throw new Error('CustomerId is required');
        }
        if (this._items.length === 0) {
            throw new Error('Items are required');
        }
        if (this._items.some(item => item.quantity <= 0)) {
            throw new Error('Quantity must be greater than 0');
        }
        return true;
    }

    get id(): string {
        return this._id;
    }

    get customerId(): string {
        return this._customerId;
    }

    get items(): OrderItem[] {
        return this._items;
    }

    get total(): number {
        return this._items.reduce((acc, item) => acc + item.price, 0);
    }

    addItem(item: OrderItem) {
        const itemExists = this._items.find(i => i.productId === item.productId);
        if(itemExists) {
            itemExists.addQuantity(item.quantity);
            this._items = [...this._items.filter(i => i.id !== itemExists.id), itemExists];
        } else {
            this._items = [...this._items, item];
        }
    }

    removeItem(item: OrderItem) {
        if (this._items.length === 1) {
            throw new Error('Items must be greater than or equal to 1');
        }
        this._items = this._items.filter(i => i.id !== item.id);
    }
}