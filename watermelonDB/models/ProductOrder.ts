import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'

export default class ProductOrder extends Model {
    static table = 'products_orders';

    static associations = {
        orders: { type: 'belongs_to', key: 'order_id' },
        products: { type: 'belongs_to', key: 'product_id' },
    } as const

    @field('order_id') orderId;
    @field('product_id') productId;
    @field('price') price;
    @field('quantity') quantity;

    @relation('orders', 'order_id') order;
    @relation('products', 'product_id') product;
}