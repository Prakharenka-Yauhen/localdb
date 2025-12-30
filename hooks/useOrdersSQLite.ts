import {useCallback, useEffect, useState} from "react";
import {Alert} from "react-native";
import {SQLiteDatabase} from "expo-sqlite";

import {getDB} from "@/sqliteDB";
import {getBEData, getRAMMemory, hashValues} from "@/utils";

type UseOrdersSQLiteProps= {
    downloadSQLiteBETime: number;
    saveSQLiteDBTime: number;
    getSQLiteDBTime: number;
    hashSQLiteTime: number;
    ramSQLiteUsage: string;
    getOrders: () => Promise<void>;
    writeOrders: () => Promise<void>;
    deleteOrdersDB: () => Promise<void>;
    hashAllSQLiteValues: () => void;
}

export const useOrdersSQLite = (): UseOrdersSQLiteProps => {
    const [BEData, setBEData] = useState<object | null>(null);
    const [downloadSQLiteBETime, setDownloadSQLiteBETime] = useState<number>(0);
    const [saveSQLiteDBTime, setSaveSQLiteDBTime] = useState<number>(0);
    const [getSQLiteDBTime, setGetSQLiteDBTime] = useState<number>(0);
    const [hashSQLiteTime, setHashSQLiteTime] = useState<number>(0);
    const [ramSQLiteUsage, setRamSQLiteUsage] = useState<string>('0');

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

        // noinspection SqlResolve
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ORDER_CONTACTS (
                order_id TEXT NOT NULL,
                contact_id INTEGER NOT NULL,
                PRIMARY KEY (order_id, contact_id),
                FOREIGN KEY (order_id) REFERENCES ORDERS(order_id),
                FOREIGN KEY (contact_id) REFERENCES CONTACTS(contact_id)
            )
      `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS PRODUCTS (
                product_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                recommend_price REAL NOT NULL
            )
      `);

        // noinspection SqlResolve
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ORDER_PRODUCTS (
                order_id TEXT NOT NULL,
                product_id TEXT NOT NULL,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL,
                PRIMARY KEY (order_id, product_id),
                FOREIGN KEY (order_id) REFERENCES ORDERS(order_id),
                FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id)
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
        setGetSQLiteDBTime(0);
        setRamSQLiteUsage('0');
        const start: number = Date.now();
        try {
            const db: SQLiteDatabase = await getDB();
            await Promise.all([
                db.getAllAsync(
                    `SELECT * FROM PRODUCTS`
                ),
                db.getAllAsync(
                    `SELECT * FROM ORDERS`
                ),
                db.getAllAsync(
                    `SELECT * FROM CONTACTS`
                ),
                db.getAllAsync(
                    `SELECT * FROM ORDER_PRODUCTS`
                ),
                db.getAllAsync(
                    `SELECT * FROM CONTRACTS`
                ),
                db.getAllAsync(
                    `SELECT * FROM ORDER_CONTACTS`
                ),
            ])
            const usedMemory: string = await getRAMMemory();
            setRamSQLiteUsage(usedMemory);
        } catch (e) {
            Alert.alert('Error getting DB data', JSON.stringify(e));
        }
        setGetSQLiteDBTime(Date.now() - start);
    }, []);

    const writeOrders = useCallback(async (): Promise<void> => {
        setDownloadSQLiteBETime(0);
        setSaveSQLiteDBTime(0);
        setRamSQLiteUsage('0');
        const start: number = Date.now();

        const objectData: any = await getBEData();
        setDownloadSQLiteBETime(Date.now() - start);
        setBEData(objectData);

        const startDB: number = Date.now();

        try {
            const db: SQLiteDatabase = await getDB();

            const orders: any[] = objectData.orders;
            const products: any[] = objectData.products;

            await db.withTransactionAsync(async () => {
                const insertOrderStmt = await db.prepareAsync(
                    `INSERT OR REPLACE INTO ORDERS (order_id, created_at, contact_id, contract_id) VALUES (?, ?, ?, ?)`
                );
                const insertContractStmt = await db.prepareAsync(
                    `INSERT OR REPLACE INTO CONTRACTS (contract_id, title, signed_date) VALUES (?, ?, ?)`
                );
                const insertContactStmt = await db.prepareAsync(
                    `INSERT OR REPLACE INTO CONTACTS (contact_id, full_name, email, phone, company) VALUES (?, ?, ?, ?, ?)`
                );
                const insertOrderContactStmt = await db.prepareAsync(
                    `INSERT OR REPLACE INTO ORDER_CONTACTS (order_id, contact_id) VALUES (?, ?)`
                );
                const insertOrderProductStmt = await db.prepareAsync(
                    `INSERT OR REPLACE INTO ORDER_PRODUCTS (order_id, product_id, price, quantity) VALUES (?, ?, ?, ?)`
                );
                const insertProductStmt = await db.prepareAsync(
                    `INSERT OR REPLACE INTO PRODUCTS (product_id, name, recommend_price) VALUES (?, ?, ?)`
                );

                try {
                    for (const order of orders) {
                        await insertOrderStmt.executeAsync([
                            order.order_id,
                            order.created_at,
                            order.contact_id,
                            order.contract_agreement.contract_id,
                        ]);

                        await insertContractStmt.executeAsync([
                            order.contract_agreement.contract_id,
                            order.contract_agreement.title,
                            order.contract_agreement.signed_date,
                        ]);

                        for (const contact of order.contacts) {
                            const contactId: string = contact.phone;
                            await insertContactStmt.executeAsync([
                                contactId,
                                contact.full_name,
                                contact.email,
                                contact.phone,
                                contact.company,
                            ]);
                            await insertOrderContactStmt.executeAsync([order.order_id, contactId]);
                        }

                        for (const productOrder of order.products_orders) {
                            await insertOrderProductStmt.executeAsync([
                                order.order_id,
                                productOrder.product_id,
                                productOrder.price,
                                productOrder.quantity,
                            ]);
                        }
                    }

                    const usedMemory: string = await getRAMMemory();
                    setRamSQLiteUsage(usedMemory);

                    for (const product of products) {
                        await insertProductStmt.executeAsync([
                            product.product_id,
                            product.name,
                            product.recommend_price,
                        ]);
                    }
                } finally {
                    await insertOrderStmt.finalizeAsync();
                    await insertContractStmt.finalizeAsync();
                    await insertContactStmt.finalizeAsync();
                    await insertOrderContactStmt.finalizeAsync();
                    await insertOrderProductStmt.finalizeAsync();
                    await insertProductStmt.finalizeAsync();
                }
            });
        } catch (e) {
            // If withTransactionAsync fails, it rolls back automatically before entering here
            Alert.alert('Transaction failed and was rolled back:', JSON.stringify(e));
            throw e;
        } finally {
            setSaveSQLiteDBTime(Date.now() - startDB);
        }
    }, []);

    const deleteOrdersDB = useCallback(async (): Promise<void> => {
        const db: SQLiteDatabase = await getDB();
        await db.execAsync(`
          DROP TABLE IF EXISTS PRODUCTS;
        `);
        await db.execAsync(`
          DROP TABLE IF EXISTS ORDERS;
        `);
        await db.execAsync(`
          DROP TABLE IF EXISTS CONTACTS;
        `);
        await db.execAsync(`
          DROP TABLE IF EXISTS ORDER_PRODUCTS;
        `);
        await db.execAsync(`
          DROP TABLE IF EXISTS CONTRACTS;
        `);
        await db.execAsync(`
          DROP TABLE IF EXISTS ORDER_CONTACTS;
        `);
        await createOrdersDB();
        setDownloadSQLiteBETime(0);
        setSaveSQLiteDBTime(0);
        setGetSQLiteDBTime(0);
        setHashSQLiteTime(0);
        setRamSQLiteUsage('0');
        // await db.closeAsync();
        // await deleteDatabaseAsync(DB_NAME);
    }, [createOrdersDB]);

    const hashAllSQLiteValues = useCallback((): void => {
        setHashSQLiteTime(0);
        const start: number = Date.now();
        hashValues(BEData);
        setHashSQLiteTime(Date.now() - start);
    }, [BEData]);

    useEffect((): void => {
        createOrdersDB().catch((e: Error): void => console.log(e));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        downloadSQLiteBETime,
        saveSQLiteDBTime,
        getSQLiteDBTime,
        hashSQLiteTime,
        ramSQLiteUsage,
        getOrders,
        writeOrders,
        deleteOrdersDB,
        hashAllSQLiteValues,
    }
}
