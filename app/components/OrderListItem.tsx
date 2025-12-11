import {JSX} from "react";
import {StyleSheet, Text, View} from "react-native";

import {Button} from "@/components/Button";
import {useLocalDBScreen} from "@/hooks/useLocalDBScreen";
import {Order} from "@/watermelonDB/models";
import {withObservables} from "@nozbe/watermelondb/react";

type OrderListItemProps = {
    order: Order;
}

const OrderListItem = ({ order }: OrderListItemProps): JSX.Element => {
    const {updateDBData, deleteDBData} = useLocalDBScreen();

    return <View style={styles.container}>
        <Text>{order.orderId}</Text>
        <Text>{order.createdAt}</Text>
        <Text>{order.contractAgreementId}</Text>
        {/*<Text>{order.isPinned ? 'true' : 'false'}</Text>*/}
        <Button title={'update'} onPress={(): void => updateDBData(order)} style={styles.updateButton} />
        <Button title={'delete'} onPress={(): void => deleteDBData(order)} style={styles.deleteButton} />
    </View>
}

const enhance = withObservables(['order'], ({order}: OrderListItemProps) => ({
    order
}))

export default enhance(OrderListItem);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
        gap: 10
    },
    updateButton: {
        backgroundColor: 'orange'
    },
    deleteButton: {
        backgroundColor: 'red'
    },
});