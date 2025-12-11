import {useCallback, useState} from "react";

import {database, ordersCollection} from "@/watermelonDB";
import {Order} from "@/watermelonDB/models";

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
        await database.write(async (): Promise<void> => {
            await ordersCollection.create((post: Order): void => {
                post.orderId = 'Title2'
                post.createdAt = 'Subtitle2'
                post.contractAgreementId = 'Body2'
            })
        })
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