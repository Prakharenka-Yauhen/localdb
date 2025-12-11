import { Model } from '@nozbe/watermelondb'
import {text, field} from '@nozbe/watermelondb/decorators';

export default class Product extends Model {
    static table = 'products';

    static associations = {
        products_orders: { type: 'has_many', foreignKey: 'product_id' }
    } as const

    @text('product_id') productId: string;
    @text('name') name: string;
    @field('recommend_price') recommendPrice: number;
}