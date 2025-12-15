import {Collection, Model} from '@nozbe/watermelondb'
import { text, field, relation } from '@nozbe/watermelondb/decorators'

import {Order, Product} from "@/watermelonDB/models/index";

export default class ProductOrder extends Model {
    static table = 'products_orders';

    static associations = {
        orders: { type: 'belongs_to', key: 'order_id' },
        products: { type: 'belongs_to', key: 'product_id' },
    } as const

    @text('order_id') orderId!: string;
    @text('product_id') productId!: string;
    @text('price') price!: string;
    @field('quantity') quantity!: number;

    @relation('orders', 'order_id') order!: Collection<Order>;
    @relation('products', 'product_id') product!: Collection<Product>;
}