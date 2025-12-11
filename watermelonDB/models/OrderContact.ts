import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'

export default class OrderContact extends Model {
    static table = 'orders_contacts';

    static associations = {
        orders: { type: 'belongs_to', key: 'order_id' },
        contacts: { type: 'belongs_to', key: 'contact_id' },
    } as const

    @field('order_id') orderId;
    @field('contact_id') contactId;

    @relation('orders', 'order_id') order;
    @relation('contacts', 'contact_id') contact;
}