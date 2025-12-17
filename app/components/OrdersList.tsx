import {JSX, useCallback} from "react";
import {FlatList, ListRenderItemInfo} from "react-native";

import {Order} from "@/watermelonDB/models";
import OrderListItem from "@/app/components/OrderListItem";
import {withObservables} from "@nozbe/watermelondb/react";
import {ordersCollection} from "@/watermelonDB";

type OrdersListProps = {
    orders: Order[];
}

const OrdersList = ({orders}: OrdersListProps): JSX.Element => {
    const renderItem = useCallback(({item}: ListRenderItemInfo<Order>): JSX.Element => {
        return <OrderListItem order={item} />
    }, [])

    return <FlatList data={orders} renderItem={renderItem} style={{flex: 1}} />
}

const enhance = withObservables([], () => ({
    orders: ordersCollection.query(),
}))

export default enhance(OrdersList);
