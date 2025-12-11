import { Model } from '@nozbe/watermelondb'
import {text, children, relation} from '@nozbe/watermelondb/decorators';

export default class Order extends Model {
    static table = 'orders'

    static associations = {
        orders_contacts: { type: 'has_many', foreignKey: 'order_id' },
        products_orders: { type: 'has_many', foreignKey: 'order_id' },
        contract_agreements: { type: 'belongs_to', key: 'contract_agreement_id' }
    }

    @text('order_id') orderId: string;
    @text('created_at') createdAt: string;
    @text('contract_agreement_id') contractAgreementId;

    @children('orders_contacts') orderContacts;
    @children('products_orders') orderProducts;

    @relation('contract_agreements', 'contract_agreement_id') contractAgreement;
}