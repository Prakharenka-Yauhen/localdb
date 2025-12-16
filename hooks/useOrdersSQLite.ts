import {useCallback, useEffect, useState} from "react";
import {SQLiteDatabase} from "expo-sqlite";

import {getDB} from "@/sqlite";
import preview from "@/watermelonDB/exampleFiles/preview.json";

type UseOrdersSQLiteProps= {
    orders: any[];
    getOrders: () => Promise<void>;
    writeOrders: () => Promise<void>;
    deleteOrdersDB: () => Promise<void>;
}

export const useOrdersSQLite = (): UseOrdersSQLiteProps => {
    const [orders, setOrders] = useState<any[]>([]);

    const createOrdersDB = useCallback(async (): Promise<void> => {
        const db: SQLiteDatabase = await getDB();

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS METADATA (
              id INTEGER PRIMARY KEY CHECK (id = 1),
              db_version INTEGER NOT NULL,
              last_updated_time INTEGER NOT NULL
            )
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ORDERS (
              order_id TEXT PRIMARY KEY,
              created_at TEXT NOT NULL,
              contact_id TEXT NOT NULL,
              contract_id TEXT NOT NULL
            )
      `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS CONTACTS (
                contact_id TEXT PRIMARY KEY,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                company TEXT NOT NULL
            )
      `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ORDER_CONTACTS (
                order_id TEXT NOT NULL,
                contact_id INTEGER NOT NULL,
                PRIMARY KEY (order_id, contact_id),
                FOREIGN KEY (order_id) REFERENCES orders(order_id),
                FOREIGN KEY (contact_id) REFERENCES contacts(contact_id)
            )
      `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS PRODUCTS (
                product_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                recommend_price REAL NOT NULL
            )
      `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ORDER_PRODUCTS (
                order_id TEXT NOT NULL,
                product_id TEXT NOT NULL,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL,
                PRIMARY KEY (order_id, product_id),
                FOREIGN KEY (order_id) REFERENCES orders(order_id),
                FOREIGN KEY (product_id) REFERENCES products(product_id)
            )
      `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS CONTRACTS (
                 contract_id TEXT PRIMARY KEY,
                 title TEXT NOT NULL,
                 signed_date TEXT NOT NULL
            )
      `);
    }, []);

    const getOrders = useCallback(async (): Promise<void> => {
        const db: SQLiteDatabase = await getDB();
        const ordersDB: any[] = await db.getAllAsync(
            `SELECT * FROM ORDERS`
        );
        setOrders(ordersDB);
    }, []);

    const writeOrders = useCallback(async (): Promise<void> => {
        const orders = preview.orders;
        const products = preview.products;
        const db: SQLiteDatabase = await getDB();

        orders.forEach((order: any): void => {
            console.log(111)
            try {
                db.runAsync(
                    `INSERT OR REPLACE INTO ORDERS (order_id, created_at, contact_id, contract_id) VALUES (?, ?, ?, ?)`,
                    [order.order_id, order.created_at, order.contact_id, order.contract_id]
                )

                db.runAsync(
                    `INSERT OR IGNORE INTO contracts (contract_id, title, signed_date) VALUES (?, ?, ?)`,
                    [
                        order.contract_agreement.contract_id,
                        order.contract_agreement.title,
                        order.contract_agreement.signed_date,
                    ]
                );

                order.contacts.forEach((contact: any): void => {
                    const contactId = contact.full_name.replace(/\s+/g, '_');
                    db.runAsync(
                        `INSERT INTO contacts (full_name, email, phone, company) VALUES (?, ?, ?, ?)`,
                        [contactId, contact.full_name, contact.email, contact.phone, contact.company]
                    );

                    db.runAsync(
                        `INSERT INTO order_contacts (order_id, contact_id) VALUES (?, ?)`,
                        [order.order_id, contactId]
                    );
                })

                order.products_orders.forEach((productsOrder: any): void => {
                    db.runAsync(
                        "INSERT INTO ORDER_PRODUCTS (order_id, product_id, price, quantity) VALUES (?, ?, ?, ?)",
                        [order.order_id, productsOrder.product_id, productsOrder.price, productsOrder.quantity]
                    );
                })
            } catch (error) {
                console.log(444)
                console.log(error)
            }
        })

        products.forEach((product: any): void => {
            db.runAsync(
                `INSERT OR REPLACE INTO PRODUCTS (product_id, name, recommend_price) VALUES (?, ?, ?)`,
                [product.product_id, product.name, product.recommend_price]
            )
        })
    }, []);

    const deleteOrdersDB = useCallback(async (): Promise<void> => {
        const db: SQLiteDatabase = await getDB();
        await db.execAsync(`
          DROP TABLE IF EXISTS ORDERS;
        `);
        // await db.closeAsync();
        // await deleteDatabaseAsync(DB_NAME);
    }, []);

    useEffect(() => {
        createOrdersDB().catch((e: Error): void => console.log(e));
    }, []);

    return {orders, getOrders, writeOrders, deleteOrdersDB}
}