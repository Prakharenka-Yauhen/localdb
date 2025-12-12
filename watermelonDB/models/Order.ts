import {Collection, Model} from '@nozbe/watermelondb'
import {text, children, relation} from '@nozbe/watermelondb/decorators';
import {ContractAgreement, OrderContact, ProductOrder} from "@/watermelonDB/models/index";

export default class Order extends Model {
    static table = 'orders'

    static associations = {
        orders_contacts: { type: 'has_many', foreignKey: 'order_id' },
        products_orders: { type: 'has_many', foreignKey: 'order_id' },
        contract_agreements: { type: 'belongs_to', key: 'contract_agreement_id' }
    } as const;

    @text('order_id') orderId!: string;
    @text('created_at') createdAt!: string;
    @text('contract_agreement_id') contractAgreementId!: string;

    @children('orders_contacts') orderContacts!: Collection<OrderContact>;
    @children('products_orders') orderProducts!: Collection<ProductOrder>;

    @relation('contract_agreements', 'contract_agreement_id') contractAgreement!: Collection<ContractAgreement>;
}