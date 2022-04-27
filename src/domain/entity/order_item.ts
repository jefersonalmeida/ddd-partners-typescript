export default class OrderItem {

    private readonly _id: string;
    private readonly _productId: string;
    private readonly _name: string;
    private readonly _price: number;
    private _quantity: number;

    constructor(id: string, productId: string, name: string, price: number, quantity: number) {
        this._id = id;
        this._productId = productId;
        this._name = name;
        this._price = price;
        this._quantity = quantity;
    }

    get id(): string {
        return this._id;
    }

    get productId(): string {
        return this._productId;
    }

    get name(): string {
        return this._name;
    }

    get quantity(): number {
        return this._quantity;
    }

    get price(): number {
        return this._price * this._quantity;
    }

    addQuantity(qtd: number) {
        this._quantity += qtd;
    }

    removeQuantity(qtd: number) {
        if (this._quantity === 1) {
            throw new Error('Quantity must be greater than or equal to 1');
        }
        this._quantity -= qtd;
    }
}