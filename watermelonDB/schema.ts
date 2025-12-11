import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'orders',
            columns: [
                { name: 'order_id', type: 'string' },
                { name: 'created_at', type: 'string' },
                { name: 'contract_agreement_id', type: 'string', isIndexed: true },
            ]
        }),
        tableSchema({
            name: 'contacts',
            columns: [
                { name: 'full_name', type: 'string' },
                { name: 'email', type: 'string' },
                { name: 'phone', type: 'string' },
                { name: 'company', type: 'string' },
            ]
        }),
        tableSchema({
            name: 'players',
            columns: [
                { name: 'age', type: 'number' },
                { name: 'player_name', type: 'string' },
                { name: 'position', type: 'string' },
            ]
        }),
        tableSchema({
            name: 'products',
            columns: [
                { name: 'product_id', type: 'string' },
                { name: 'name', type: 'string' },
                { name: 'recommend_price', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'orders_contacts',
            columns: [
                { name: 'order_id', type: 'string', isIndexed: true },
                { name: 'contact_id', type: 'string', isIndexed: true },
            ]
        }),
        tableSchema({
            name: 'products_orders',
            columns: [
                { name: 'product_id', type: 'string', isIndexed: true },
                { name: 'order_id', type: 'string', isIndexed: true },
                { name: 'price', type: 'number' },
                { name: 'quantity', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'contract_agreements',
            columns: [
                { name: 'contract_id', type: 'string' },
                { name: 'title', type: 'string' },
                { name: 'signed_date', type: 'string' },
            ]
        }),
    ]
})