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
import preview from '../watermelonDB/exampleFiles/preview.json';

type UseLocalDBScreenProps = {
    ordersList: Order[];
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
    const [saveTime, setSaveTime] = useState<number>(0);
    const [getTime, setGetTime] = useState<number>(0);

    const getDBData = useCallback(async (): Promise<void> => {
        const start: number = Date.now();
        const orders: Order[] = await ordersCollection.query().fetch();
        const end: number = Date.now();
        setGetTime(end - start);
        setOrdersList(orders);
    }, []);

    const writeDBData = useCallback(async (): Promise<void> => {
        const start: number = Date.now();

        const products = preview.products;
        const existingProducts: Product[] = await productsCollection.query().fetch();
        const existingProductsIds = new Set(existingProducts.map((product: Product): string => product.productId));
        const newProducts: any[] = products.filter((product: any): boolean => !existingProductsIds.has(product.productId));

        const orders = preview.orders;
        const existingOrders: Order[] = await ordersCollection.query().fetch();
        const existingOrdersIds = new Set(existingOrders.map((order: Order): string => order.orderId));
        const newOrders: any[] = orders.filter((order: any): boolean => !existingOrdersIds.has(order.orderId));

        const allContacts: any[] = preview.orders.flatMap((order: any): any => order.contacts);
        const contacts: any[] = Array.from(
            new Map(allContacts.map((contact: any) => [contact.email.toLowerCase(), contact])).values()
        );
        const existingContacts: Contact[] = await contactsCollection.query().fetch();
        const existingContactsIds = new Set(existingContacts.map((contact: Contact): string => contact.email.toLowerCase()));
        const newContacts: any[] = contacts.filter((contact: any): boolean => !existingContactsIds.has(contact.email.toLowerCase()));

        const allProductOrders: any[] = preview.orders.flatMap((order: any): any => order.products_orders);
        const productOrders: any[] = Array.from(
            new Map(allProductOrders.map((productOrder: any) => [productOrder.productId, productOrder])).values()
        );
        const existingProductOrders: ProductOrder[] = await productOrdersCollection.query().fetch();
        const existingProductOrdersIds = new Set(existingProductOrders.map((productOrder: ProductOrder): string => productOrder.productId));
        const newProductOrders: any[] = productOrders.filter((productOrder: any): boolean => !existingProductOrdersIds.has(productOrder.productId));

        const allContractAgreements: any[] = preview.orders.map((order: any):any => order.contract_agreement);
        const contractAgreements: any[] = Array.from(
            new Map(allContractAgreements.map((contractAgreement: any) => [contractAgreement.contractAgreementId, contractAgreement])).values()
        );
        const existingContractAgreements: ContractAgreement[] = await contractAgreementsCollection.query().fetch();
        const existingContractAgreementsIds = new Set(existingContractAgreements.map((contractAgreement: ContractAgreement): string => contractAgreement.contractId));
        const newContractAgreements: any[] = contractAgreements.filter((contractAgreement: any): boolean => !existingContractAgreementsIds.has(contractAgreement.contractAgreementId));

        const existingOrderContacts: OrderContact[] = await orderContactsCollection.query().fetch();

        const batch: (Order | ContractAgreement | Contact | OrderContact | Product | ProductOrder)[] = [];

        products.forEach((productData: any): void => {
            const existingProduct: Product | undefined = existingProducts.find((product: Product): any | undefined => product.productId === productData.product_id);

            if (existingProduct) {
                const batchUpdateProducts: Product = existingProduct.prepareUpdate((product: Product): void => {
                    product._raw.id = productData['product_id'];
                    product.productId = productData['product_id'];
                    product.name = productData.name;
                    product.recommendPrice = productData['recommend_price'];
                });

                batch.push(batchUpdateProducts);
            } else {
                const batchNewProducts: Product = productsCollection.prepareCreate((product: Product): void => {
                    product._raw.id = productData['product_id'];
                    product.productId = productData['product_id'];
                    product.name = productData.name;
                    product.recommendPrice = productData['recommend_price'];
                });

                batch.push(batchNewProducts);
            }
        });

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
                const existingContact: Contact | undefined = existingContacts.find((contact: Contact): any | undefined => contact._raw.id === contractData["full_name"].replace(/\s+/g, '_'));

                if (existingContact) {
                    const batchUpdateContract: Contact = existingContact.prepareUpdate((contact: Contact): void => {
                        contact._raw.id = `${contractData["full_name"].replace(/\s+/g, '_')}`;
                        contact.fullName = contractData["full_name"];
                        contact.email = contractData.email;
                        contact.phone = contractData.phone;
                        contact.company = contractData.company;
                    });

                    batch.push(batchUpdateContract);
                } else {
                    const batchNewContract: Contact = contactsCollection.prepareCreate((contact: Contact): void => {
                        contact._raw.id = `${contractData["full_name"].replace(/\s+/g, '_')}`;
                        contact.fullName = contractData["full_name"];
                        contact.email = contractData.email;
                        contact.phone = contractData.phone;
                        contact.company = contractData.company;
                    });

                    batch.push(batchNewContract);
                }

                const existingOrderContact: OrderContact | undefined = existingOrderContacts.find((orderContact: OrderContact): any | undefined => orderContact._raw.id === contractData["full_name"].replace(/\s+/g, '_'));

                if (existingOrderContact) {
                    const batchUpdateOrderContacts: OrderContact = existingOrderContact.prepareUpdate((orderContact: OrderContact): void => {
                        orderContact.orderId = orderData["order_id"];
                        orderContact.contactId = orderData["contact_id"];
                    });

                    batch.push(batchUpdateOrderContacts);
                } else {
                    const batchNewOrderContacts: OrderContact = orderContactsCollection.prepareCreate((orderContact: OrderContact): void => {
                        orderContact.orderId = orderData["order_id"];
                        orderContact.contactId = orderData["contact_id"];
                    });

                    batch.push(batchNewOrderContacts);
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
        const end: number = Date.now();
        setSaveTime(end - start);
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
    }, []);

    return {
        ordersList,
        saveTime,
        getTime,
        getDBData,
        writeDBData,
        updateDBData,
        deleteDBData,
        resetDBData
    }
}