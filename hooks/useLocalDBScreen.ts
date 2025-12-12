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
    getDBData: () => void;
    writeDBData: () => void;
    updateDBData: (post: Order) => void;
    deleteDBData: (post: Order) => void;
    resetDBData: () => void;
}

export const useLocalDBScreen = (): UseLocalDBScreenProps => {
    const [ordersList, setOrdersList] = useState<Order[]>([]);

    const getDBData = useCallback(async (): Promise<void> => {
        const orders: Order[] = await ordersCollection.query().fetch();
        setOrdersList(orders);
    }, []);

    const writeDBData = useCallback(async (): Promise<void> => {
        const products = preview.products;
        const orders = preview.orders;

        const batch: (Order | ContractAgreement | Contact | OrderContact | Product | ProductOrder)[] = [];

        products.forEach((productData: any): void => {
            const batchNewProducts: Product = productsCollection.prepareCreate((product: Product): void => {
                product._raw.id = productData['product_id'];
                product.productId = productData['product_id'];
                product.name = productData.name;
                product.recommendPrice = productData['recommend_price'];
            });

            batch.push(batchNewProducts);
        });

        orders.forEach((orderData: any): void => {
            const batchNewOrder: Order = ordersCollection.prepareCreate((order: Order): void => {
                order._raw.id = orderData["order_id"];
                order.orderId = orderData["order_id"];
                order.createdAt = orderData["created_at"];
                order.contractAgreementId = orderData["contract_id"];
            });

            batch.push(batchNewOrder);

            const contractAgreementData: any = orderData.contract_agreement;

            const batchNewContractAgreement: ContractAgreement = contractAgreementsCollection.prepareCreate((contractAgreement: ContractAgreement): void => {
                contractAgreement._raw.id = contractAgreementData['contract_id'];
                contractAgreement.contractId = contractAgreementData['contract_id'];
                contractAgreement.title = contractAgreementData.title;
                contractAgreement.signedDate = contractAgreementData['signed_date'];
            });

            batch.push(batchNewContractAgreement);

            const contracts: any[] = orderData.contacts;

            contracts.forEach((contractData: any): void => {
                const batchNewContract: Contact = contactsCollection.prepareCreate((contact: Contact): void => {
                    contact._raw.id = `${contractData["full_name"].replace(/\s+/g, '_')}`;
                    contact.fullName = contractData["full_name"];
                    contact.email = contractData.email;
                    contact.phone = contractData.phone;
                    contact.company = contractData.company;
                });

                batch.push(batchNewContract);

                const batchNewOrderContacts: OrderContact = orderContactsCollection.prepareCreate((orderContact: OrderContact): void => {
                    orderContact.orderId = orderData["order_id"];
                    orderContact.contactId = batchNewContractAgreement.id;
                });

                batch.push(batchNewOrderContacts);
            })

            const orderProducts: any[] = orderData["products_orders"];

            orderProducts.forEach((productData: any): void => {
                const batchNewProductOrder: ProductOrder = productOrdersCollection.prepareCreate((product: ProductOrder): void => {
                    product.orderId = orderData["order_id"];
                    product.productId = productData["product_id"];
                    product.price = productData.price;
                    product.quantity = productData.quantity;
                });

                batch.push(batchNewProductOrder);
            });
        })

        await database.write(async (): Promise<void> => {
            await database.batch(...batch)
        });
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

    return {ordersList, getDBData, writeDBData, updateDBData, deleteDBData, resetDBData}
}