import {useCallback, useState} from "react";

import {
    database,
    ordersCollection,
    contractAgreementsCollection,
    productsCollection,
    contactsCollection,
    orderContactsCollection,
    productOrdersCollection
} from "@/watermelonDB";
import {
    Contact,
    Order,
    OrderContact,
    Product,
    ProductOrder,
    ContractAgreement
} from "@/watermelonDB/models";
// import preview from '../watermelonDB/exampleFiles/preview.json';
// import mock_data_29_4 from "@/watermelonDB/exampleFiles/mock_data_29_4.json";
import RNFS from "react-native-fs";

type UseLocalDBScreenProps = {
    ordersList: Order[];
    downloadTime: number;
    saveTime: number;
    getTime: number;
    getDBData: () => void;
    writeDBData: () => void;
    updateDBData: (post: Order) => void;
    deleteDBData: (post: Order) => void;
    resetDBData: () => void;
}

export const useLocalDBScreen = (): UseLocalDBScreenProps => {
    const [ordersList, setOrdersList] = useState<Order[]>([]);
    const [downloadTime, setDownloadTime] = useState<number>(0);
    const [saveTime, setSaveTime] = useState<number>(0);
    const [getTime, setGetTime] = useState<number>(0);

    const getDBData = useCallback(async (): Promise<void> => {
        setGetTime(0);
        const start: number = Date.now();
        try {
            const existingProducts: Product[] = await productsCollection.query().fetch();
            const existingOrders: Order[] = await ordersCollection.query().fetch();
            const existingContacts: Contact[] = await contactsCollection.query().fetch();
            const existingProductOrders: ProductOrder[] = await productOrdersCollection.query().fetch();
            const existingContractAgreements: ContractAgreement[] = await contractAgreementsCollection.query().fetch();
            const existingOrderContacts: OrderContact[] = await orderContactsCollection.query().fetch();
            console.log('getDBData')
            console.log(existingProducts.length)
            console.log(existingOrders.length)
            console.log(existingContacts.length)
            console.log(existingProductOrders.length)
            console.log(existingContractAgreements.length)
            console.log(existingOrderContacts.length)
        } catch (e) {
            console.log(e)
        }
        // setOrdersList(existingOrders);
        const end: number = Date.now();
        setGetTime(end - start);
    }, []);

    const writeDBData = useCallback(async (): Promise<void> => {
        try {
            setDownloadTime(0);
            setSaveTime(0);
            const start: number = Date.now();

            const api: string = "https://mock-backend-nest.cfapps.eu10-004.hana.ondemand.com/sync-lite";
            const path = `${RNFS.DocumentDirectoryPath}/data.json`;

            const download = await RNFS.downloadFile({
                fromUrl: api,
                toFile: path,
            }).promise;

            const getJsonData = async () => {
                const path = `${RNFS.DocumentDirectoryPath}/data.json`;
                const jsonString = await RNFS.readFile(path, 'utf8');
                return JSON.parse(jsonString);
            };

            let jsonData = await getJsonData();

            setDownloadTime(Date.now() - start);
            const startDB = Date.now();

            const products = jsonData.products;
            const orders = jsonData.orders;

            const existingProducts: Product[] = await productsCollection.query().fetch();
            const existingOrders: Order[] = await ordersCollection.query().fetch();
            const existingContacts: Contact[] = await contactsCollection.query().fetch();
            const existingProductOrders: ProductOrder[] = await productOrdersCollection.query().fetch();
            const existingContractAgreements: ContractAgreement[] = await contractAgreementsCollection.query().fetch();
            const existingOrderContacts: OrderContact[] = await orderContactsCollection.query().fetch();

            const batchProducts: (Order | ContractAgreement | Contact | OrderContact | Product | ProductOrder)[] = [];

            products.forEach((productData: any): void => {
                const existingProduct: Product | undefined = existingProducts.find((product: Product): any | undefined => product.productId === productData.product_id);

                if (existingProduct) {
                    const batchUpdateProducts: Product = existingProduct.prepareUpdate((product: Product): void => {
                        product._raw.id = productData['product_id'];
                        product.productId = productData['product_id'];
                        product.name = productData.name;
                        product.recommendPrice = productData['recommend_price'];
                    });

                    batchProducts.push(batchUpdateProducts);
                } else {
                    const batchNewProducts: Product = productsCollection.prepareCreate((product: Product): void => {
                        product._raw.id = productData['product_id'];
                        product.productId = productData['product_id'];
                        product.name = productData.name;
                        product.recommendPrice = productData['recommend_price'];
                    });

                    batchProducts.push(batchNewProducts);
                }
            });

            await database.write(async (): Promise<void> => {
                await database.batch(...batchProducts)
            });

            const batch: (Order | ContractAgreement | Contact | OrderContact | Product | ProductOrder)[] = [];
            const batch2: (Order | ContractAgreement | Contact | OrderContact | Product | ProductOrder)[] = [];

            orders.forEach((orderData: any): void => {
                const existingOrder: Order | undefined = existingOrders.find((order: Order): any | undefined => order.orderId === orderData.order_id);
                if (existingOrder) {
                    const batchUpdateOrder: Order = existingOrder.prepareUpdate((order: Order): void => {
                        order._raw.id = orderData["order_id"];
                        order.orderId = orderData["order_id"];
                        order.createdAt = orderData["created_at"];
                        order.contractAgreementId = orderData["contract_id"];
                    });

                    batch.push(batchUpdateOrder);
                } else {
                    const batchCreateOrder: Order = ordersCollection.prepareCreate((order: Order): void => {
                        order._raw.id = orderData["order_id"];
                        order.orderId = orderData["order_id"];
                        order.createdAt = orderData["created_at"];
                        order.contractAgreementId = orderData["contract_id"];
                    });

                    batch.push(batchCreateOrder);
                }

                const contractAgreementData: any = orderData.contract_agreement;
                const existingContractAgreement: ContractAgreement | undefined = existingContractAgreements.find((contractAgreement: ContractAgreement): any | undefined => contractAgreement.contractId === contractAgreementData.contract_id);

                if (existingContractAgreement) {
                    const batchUpdateContractAgreement: ContractAgreement = existingContractAgreement.prepareUpdate((contractAgreement: ContractAgreement): void => {
                        contractAgreement._raw.id = contractAgreementData['contract_id'];
                        contractAgreement.contractId = contractAgreementData['contract_id'];
                        contractAgreement.title = contractAgreementData.title;
                        contractAgreement.signedDate = contractAgreementData['signed_date'];
                    });

                    batch.push(batchUpdateContractAgreement);
                } else {
                    const batchNewContractAgreement: ContractAgreement = contractAgreementsCollection.prepareCreate((contractAgreement: ContractAgreement): void => {
                        contractAgreement._raw.id = contractAgreementData['contract_id'];
                        contractAgreement.contractId = contractAgreementData['contract_id'];
                        contractAgreement.title = contractAgreementData.title;
                        contractAgreement.signedDate = contractAgreementData['signed_date'];
                    });

                    batch.push(batchNewContractAgreement);
                }

                const contracts: any[] = orderData.contacts;

                contracts.forEach((contractData: any): void => {
                    const existingContact: Contact | undefined = existingContacts.find((contact: Contact): any | undefined => contact._raw.id === contractData.phone);

                    if (existingContact) {
                        const batchUpdateContract: Contact = existingContact.prepareUpdate((contact: Contact): void => {
                            contact._raw.id = contractData.phone;
                            contact.fullName = contractData["full_name"];
                            contact.email = contractData.email;
                            contact.phone = contractData.phone;
                            contact.company = contractData.company;
                        });

                        batch2.push(batchUpdateContract);
                    } else {
                        const batchNewContract: Contact = contactsCollection.prepareCreate((contact: Contact): void => {
                            contact._raw.id = contractData.phone;
                            contact.fullName = contractData["full_name"];
                            contact.email = contractData.email;
                            contact.phone = contractData.phone;
                            contact.company = contractData.company;
                        });

                        batch2.push(batchNewContract);
                    }

                    const existingOrderContact: OrderContact | undefined = existingOrderContacts.find((orderContact: OrderContact): any | undefined => orderContact._raw.id === contractData.phone);

                    if (existingOrderContact) {
                        const batchUpdateOrderContacts: OrderContact = existingOrderContact.prepareUpdate((orderContact: OrderContact): void => {
                            orderContact.orderId = orderData["order_id"];
                            orderContact.contactId = orderData["contact_id"];
                        });

                        batch2.push(batchUpdateOrderContacts);
                    } else {
                        const batchNewOrderContacts: OrderContact = orderContactsCollection.prepareCreate((orderContact: OrderContact): void => {
                            orderContact.orderId = orderData["order_id"];
                            orderContact.contactId = orderData["contact_id"];
                        });

                        batch2.push(batchNewOrderContacts);
                    }
                })

                const productOrders: any[] = orderData["products_orders"];

                productOrders.forEach((productData: any): void => {
                    const existingProductOrder: ProductOrder | undefined = existingProductOrders.find((productOrder: ProductOrder): any | undefined => productOrder.productId === productData.product_id);

                    if (existingProductOrder) {
                        const batchUpdateProductOrder: ProductOrder = existingProductOrder.prepareUpdate((product: ProductOrder): void => {
                            product.orderId = orderData["order_id"];
                            product.productId = productData["product_id"];
                            product.price = productData.price;
                            product.quantity = productData.quantity;
                        });

                        batch.push(batchUpdateProductOrder);
                    } else {
                        const batchNewProductOrder: ProductOrder = productOrdersCollection.prepareCreate((product: ProductOrder): void => {
                            product.orderId = orderData["order_id"];
                            product.productId = productData["product_id"];
                            product.price = productData.price;
                            product.quantity = productData.quantity;
                        });

                        batch.push(batchNewProductOrder);
                    }
                });
            })

            await database.write(async (): Promise<void> => {
                await database.batch(...batch)
            });
            await database.write(async (): Promise<void> => {
                await database.batch(...batch2)
            });
            setSaveTime(Date.now() - startDB);
        } catch (e) {
            console.log(e)
        }
    }, []);

    const updateDBData = useCallback(async (updatedPost: Order): Promise<void> => {
        await database.write(async (): Promise<void> => {
            await updatedPost.update((post: Order) => {
                post.orderId = 'Title3'
                post.createdAt = 'Subtitle3'
                post.contractAgreementId = 'Body3'
            })
        });
    }, []);

    const deleteDBData = useCallback(async (post: Order): Promise<void> => {
        await database.write(async (): Promise<void> => {
            await post.destroyPermanently();
        });
    }, []);

    const resetDBData = useCallback(async (): Promise<void> => {
        await database.write(async (): Promise<void> => {
            await database.unsafeResetDatabase();
        });
        setSaveTime(0);
        setGetTime(0);
    }, []);

    return {
        ordersList,
        downloadTime,
        saveTime,
        getTime,
        getDBData,
        writeDBData,
        updateDBData,
        deleteDBData,
        resetDBData
    }
}