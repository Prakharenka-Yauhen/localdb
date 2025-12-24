import {useCallback, useEffect, useState} from "react";
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
        setGetSQLiteDBTime(0);
        setRamSQLiteUsage('0');
        const start: number = Date.now();
        const db: SQLiteDatabase = await getDB();
        const productsDB: any[] = await db.getAllAsync(
            `SELECT * FROM PRODUCTS`
        );
        const ordersDB: any[] = await db.getAllAsync(
            `SELECT * FROM ORDERS`
        );
        const contactsDB: any[] = await db.getAllAsync(
            `SELECT * FROM CONTACTS`
        );
        const usedMemory: string = await getRAMMemory();
        setRamSQLiteUsage(usedMemory);
        const productOrdersDB: any[] = await db.getAllAsync(
            `SELECT * FROM ORDER_PRODUCTS`
        );
        const contractAgreementsDB: any[] = await db.getAllAsync(
            `SELECT * FROM CONTRACTS`
        );
        const orderContactsDB: any[] = await db.getAllAsync(
            `SELECT * FROM ORDER_CONTACTS`
        );
        console.log('getOrders');
        console.log(productsDB.length);
        console.log(ordersDB.length);
        console.log(contactsDB.length);
        console.log(productOrdersDB.length);
        console.log(contractAgreementsDB.length);
        console.log(orderContactsDB.length);
        const end: number = Date.now();
        setGetSQLiteDBTime(end - start);
    }, []);

    const writeOrders = useCallback(async (): Promise<void> => {
        setDownloadSQLiteBETime(0);
        setSaveSQLiteDBTime(0);
        setRamSQLiteUsage('0');
        const start: number = Date.now();

        const objectData: any = await getBEData();
        setDownloadSQLiteBETime(Date.now() - start);

        setBEData(objectData);

        const startDB = Date.now();
        const db: SQLiteDatabase = await getDB();

        const orders = objectData.orders;
        const products = objectData.products;

        await db.runAsync("BEGIN TRANSACTION");

        const insertOrderStmt = await db.prepareAsync(
            `INSERT OR REPLACE INTO ORDERS
     (order_id, created_at, contact_id, contract_id)
     VALUES (?, ?, ?, ?)`
        );

        const insertContractStmt = await db.prepareAsync(
            `INSERT OR REPLACE INTO CONTRACTS
     (contract_id, title, signed_date)
     VALUES (?, ?, ?)`
        );

        const insertContactStmt = await db.prepareAsync(
            `INSERT OR REPLACE INTO CONTACTS
     (contact_id, full_name, email, phone, company)
     VALUES (?, ?, ?, ?, ?)`
        );

        const insertOrderContactStmt = await db.prepareAsync(
            `INSERT OR REPLACE INTO ORDER_CONTACTS
     (order_id, contact_id)
     VALUES (?, ?)`
        );

        const insertOrderProductStmt = await db.prepareAsync(
            `INSERT OR REPLACE INTO ORDER_PRODUCTS
     (order_id, product_id, price, quantity)
     VALUES (?, ?, ?, ?)`
        );

        const insertProductStmt = await db.prepareAsync(
            `INSERT OR REPLACE INTO PRODUCTS
     (product_id, name, recommend_price)
     VALUES (?, ?, ?)`
        );

        try {
            // Orders
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

                // Contacts
                for (const contact of order.contacts) {
                    const contactId = contact.full_name.replace(/\s+/g, "_");

                    await insertContactStmt.executeAsync([
                        contactId,
                        contact.full_name,
                        contact.email,
                        contact.phone,
                        contact.company,
                    ]);

                    await insertOrderContactStmt.executeAsync([
                        order.order_id,
                        contactId,
                    ]);
                }

                // Order products
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

            // Products
            for (const product of products) {
                await insertProductStmt.executeAsync([
                    product.product_id,
                    product.name,
                    product.recommend_price,
                ]);
            }

            await db.runAsync("COMMIT");
        } catch (e) {
            await db.runAsync("ROLLBACK");
            throw e;
        } finally {
            await insertOrderStmt.finalizeAsync();
            await insertContractStmt.finalizeAsync();
            await insertContactStmt.finalizeAsync();
            await insertOrderContactStmt.finalizeAsync();
            await insertOrderProductStmt.finalizeAsync();
            await insertProductStmt.finalizeAsync();

            setSaveSQLiteDBTime(Date.now() - startDB);
        }
    }, []);

    // const writeOrders = useCallback(async (): Promise<void> => {
    //     const start: number = Date.now();
    //     const orders = mock_data_29_4.orders;
    //     const products = mock_data_29_4.products;
    //     const db: SQLiteDatabase = await getDB();
    //

        // const download = await RNFS.downloadFile({
        //     fromUrl: api,
        //     toFile: path,
        //     // progressDivider: 5,
        //     // progress: (res) => {
        //     //     if (res.contentLength > 0) {
        //     //         const progress = (
        //     //             res.bytesWritten / res.contentLength
        //     //         ).toFixed(2);
        //     //         console.log('Progress:', progress);
        //     //     }
        //     // },
        // }).promise;
    //
    //     // const api: string = "https://vw-mock-backend.cfapps.eu10-004.hana.ondemand.com/sync";
    //     // try {
    //     //     const response = await axios.get(api);
    //     // } catch (error) {
    //     //     console.log(error)
    //     // }
    //
    //     orders.forEach((order: any): void => {
    //         db.runAsync(
    //             `INSERT OR REPLACE INTO ORDERS (order_id, created_at, contact_id, contract_id) VALUES (?, ?, ?, ?)`,
    //             [order.order_id, order.created_at, order.contact_id, order.contract_id]
    //         ).catch((err: Error) => {
    //             console.log(7774);
    //         })
    //
    //         db.runAsync(
    //             `INSERT OR REPLACE INTO CONTRACTS (contract_id, title, signed_date) VALUES (?, ?, ?)`,
    //             [
    //                 order.contract_agreement.contract_id,
    //                 order.contract_agreement.title,
    //                 order.contract_agreement.signed_date,
    //             ]
    //         ).catch((err: Error) => {
    //             console.log(7774);
    //         });
    //
    //         order.contacts.forEach((contact: any): void => {
    //             const contactId = contact.full_name.replace(/\s+/g, '_');
    //             db.runAsync(
    //                 `INSERT OR REPLACE INTO CONTACTS (full_name, email, phone, company) VALUES (?, ?, ?, ?)`,
    //                 [contactId, contact.full_name, contact.email, contact.phone, contact.company]
    //             ).catch((err: Error) => {
    //                 console.log(7774);
    //             });
    //
    //             db.runAsync(
    //                 `INSERT OR REPLACE INTO ORDER_CONTACTS (order_id, contact_id) VALUES (?, ?)`,
    //                 [order.order_id, contactId]
    //             ).catch((err: Error) => {
    //                 console.log(7774);
    //             });
    //         })
    //
    //         order.products_orders.forEach((productsOrder: any): void => {
    //             db.runAsync(
    //                 "INSERT OR REPLACE INTO ORDER_PRODUCTS (order_id, product_id, price, quantity) VALUES (?, ?, ?, ?)",
    //                 [order.order_id, productsOrder.product_id, productsOrder.price, productsOrder.quantity]
    //             ).catch((err: Error) => {
    //                 console.log(7774);
    //             }).finally(() => {
    //                 const end: number = Date.now();
    //                 setSaveSQLiteDBTime(end - start);
    //             })
    //         })
    //     })
    //
    //     products.forEach((product: any): void => {
    //         db.runAsync(
    //             `INSERT OR REPLACE INTO PRODUCTS (product_id, name, recommend_price) VALUES (?, ?, ?)`,
    //             [product.product_id, product.name, product.recommend_price]
    //         ).then(() => {
    //             const end: number = Date.now();
    //             setSaveSQLiteDBTime(end - start);
    //         }).catch((err: Error) => {
    //             console.log(7774);
    //         });
    //     })
    // }, []);

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