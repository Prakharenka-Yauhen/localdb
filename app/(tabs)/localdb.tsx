import {FlatList, ListRenderItemInfo, StyleSheet, Text, View} from "react-native";
import {JSX, useCallback} from "react";

import {Button} from "@/components/Button";
import {useLocalDBScreen} from "@/hooks/useLocalDBScreen";
import {Order} from "@/watermelonDB/models";

export default function LocalDBScreen(): JSX.Element {
    const {ordersList, getDBData, writeDBData, updateDBData, deleteDBData} = useLocalDBScreen();

    const renderItem = useCallback(({item}: ListRenderItemInfo<Order>): JSX.Element => {
        return <View style={styles.listItem}>
            <Text>{item.title}</Text>
            <Text>{item.subtitle}</Text>
            <Text>{item.body}</Text>
            <Text>{item.isPinned ? 'true' : 'false'}</Text>
            <Button title={'update'} onPress={(): void => updateDBData(item)} style={styles.updateButton} />
            <Button title={'delete'} onPress={(): void => deleteDBData(item)} style={styles.deleteButton} />
        </View>
    }, [updateDBData, deleteDBData])

    return <View style={styles.container}>
        <View style={styles.horizontal}>
            <Button title={'Get DB data'} onPress={getDBData} style={styles.getButton} />
            <Button title={'Write DB data'} onPress={writeDBData} style={styles.writeButton} />
        </View>
        <FlatList data={ordersList} renderItem={renderItem} />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    horizontal: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    getButton: {
        backgroundColor: 'blue'
    },
    writeButton: {
        backgroundColor: 'green'
    },
    updateButton: {
        backgroundColor: 'orange'
    },
    deleteButton: {
        backgroundColor: 'red'
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
        gap: 10
    }
});
