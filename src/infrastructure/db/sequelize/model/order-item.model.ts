import {BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table} from 'sequelize-typescript';
import ProductModel from './product.model';
import OrderModel from './order.model';

@Table({
    tableName: 'orders_items',
    timestamps: false,
})
export default class OrderItemModel extends Model {

    @PrimaryKey
    @Column
    declare id: string;

    @ForeignKey(() => OrderModel)
    @Column({allowNull: false})
    declare orderId: string;

    @ForeignKey(() => ProductModel)
    @Column({allowNull: false})
    declare productId: string;

    @Column({allowNull: false})
    declare name: string;

    @Column({allowNull: false})
    declare quantity: number;

    @Column({allowNull: false})
    declare price: number;

    @BelongsTo(() => OrderModel)
    declare order: OrderModel;

    @BelongsTo(() => ProductModel)
    declare product: ProductModel;
}