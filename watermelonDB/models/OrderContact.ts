import {Collection, Model} from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'

import {Contact, Order} from "@/watermelonDB/models/index";

export default class OrderContact extends Model {
    static table = 'order_contacts';

    static associations = {
        orders: { type: 'belongs_to', key: 'order_id' },
        contacts: { type: 'belongs_to', key: 'contact_id' },
    } as const

    @field('order_id') orderId!: string;
    @field('contact_id') contactId!: string;

    @relation('orders', 'order_id') order!: Collection<Order>;
    @relation('contacts', 'contact_id') contact!: Collection<Contact>;
}