export interface InputListProductDto {
}


type Product = {
    id: string;
    name: string;
    price: number;
}

export interface OutputListProductDto {
    products: Product[],
}

export class OutputProductMapper {
    static toOutput(products: Product[]): OutputListProductDto {
        return {
            products: products.map(c => ({
                id: c.id,
                name: c.name,
                price: c.price,
            })),
        };
    }
}