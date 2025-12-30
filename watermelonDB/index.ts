import {Alert} from 'react-native'
import {Collection, Database} from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './schema'
import migrations from './migrations'
import {
    Contact,
    Contract,
    Order,
    Player,
    Product,
    OrderContact,
    ContractAgreement,
    ProductOrder
} from "./models";

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
    schema,
    // (You might want to comment it out for development purposes -- see Migrations documentation)
    migrations,
    // (optional database name or file system path)
    // dbName: 'myapp',
    // (recommended option, should work flawlessly out of the box on iOS. On Android,
    // additional installation steps have to be taken - disable if you run into issues...)
    // jsi: true, /* Platform.OS === 'ios' */
    jsi: false,
    // (optional, but you should implement this method)
    onSetUpError: (error: Error): void => {
        Alert.alert('Database failed to load:', JSON.stringify(error));
    }
})

// Then, make a Watermelon database from it!
export const database = new Database({
    adapter,
    modelClasses: [Contact, Contract, Order, Player, Product, OrderContact, ContractAgreement, ProductOrder],
})

export const ordersCollection: Collection<Order> =
    database.get<Order>('orders');
export const playersCollection: Collection<Player> =
    database.get<Player>('players');
export const productsCollection: Collection<Product> =
    database.get<Product>('products');
export const contractAgreementsCollection: Collection<ContractAgreement> =
    database.get<ContractAgreement>('contract_agreements');
export const contactsCollection: Collection<Contact> =
    database.get<Contact>('contacts');
export const orderContactsCollection: Collection<OrderContact> =
    database.get<OrderContact>('order_contacts');
export const productOrdersCollection: Collection<ProductOrder> =
    database.get<ProductOrder>('products_orders');
