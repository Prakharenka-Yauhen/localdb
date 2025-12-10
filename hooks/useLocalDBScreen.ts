import {useCallback, useState} from "react";
import {database, ordersCollection} from "@/watermelonDB";

import {Order} from "@/watermelonDB/models";

type UseLocalDBScreenProps = {
    ordersList: Order[];
    getDBData: () => void;
    writeDBData: () => void;
    updateDBData: (post: Order) => void;
    deleteDBData: (post: Order) => void;
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
                post.title = 'Title2'
                post.subtitle = 'Subtitle2'
                post.body = 'Body2'
                post.isPinned = false
            })
        })
    }, []);

    const updateDBData = useCallback(async (updatedPost: Order): Promise<void> => {
        await database.write(async (): Promise<void> => {
            await updatedPost.update((post: Order) => {
                post.title = 'Title3'
                post.subtitle = 'Subtitle3'
                post.body = 'Body3'
                post.isPinned = true
            })
        });
    }, []);

    const deleteDBData = useCallback(async (post: Order): Promise<void> => {
        await database.write(async (): Promise<void> => {
            await post.destroyPermanently();
        });
    }, []);

    return {ordersList, getDBData, writeDBData, updateDBData, deleteDBData}
}