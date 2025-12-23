import {StyleSheet, Text, View} from "react-native";
import {JSX} from "react";

import {Button} from "@/components/Button";
import {useGetPlayers, useLocalDBScreen, useOrdersSQLite} from "@/hooks";
import OrdersList from "@/app/components/OrdersList";
import PlayersList from "@/app/components/PlayersList";

export default function LocalDBScreen(): JSX.Element {
    const {getPlayers, writePlayers} = useGetPlayers();
    const {downloadTime, saveTime, getTime, getDBData, writeDBData, resetDBData} = useLocalDBScreen();
    const {downloadSQLiteBETime, saveSQLiteDBTime, getSQLiteDBTime, getOrders, writeOrders, deleteOrdersDB} = useOrdersSQLite();

    return <View style={styles.container}>
        {/*<View style={styles.horizontal}>*/}
        {/*    <Button title={'Get sport data'} onPress={getPlayers} style={styles.getButton} />*/}
        {/*    <Button title={'Write sport data'} onPress={writePlayers} style={styles.writeButton} />*/}
        {/*</View>*/}
        {/*<PlayersList />*/}
        <View style={styles.horizontal}>
            <Button title={'Get WaterDB data'} onPress={() => {
                getDBData();
            }} style={styles.getButton} />
            <Button title={'Write WaterDB data'} onPress={() => {
                writeDBData();
            }} style={styles.writeButton} />
        </View>
        <View style={styles.horizontal}>
            <Button title={'Get SQliteDB data'} onPress={() => {
                getOrders();
            }} style={styles.getButton} />
            <Button title={'Write SQliteDB data'} onPress={() => {
                writeOrders();
            }} style={styles.writeButton} />
        </View>
        <View style={styles.horizontal}>
            <Button title={'Reset DB data'} onPress={() => {
                resetDBData();
                deleteOrdersDB();
            }} style={styles.deleteButton} />
        </View>
        <Text style={styles.text}>{`Download time to Watermelon: ${downloadTime}`}</Text>
        <Text style={styles.text}>{`Save time to Watermelon: ${saveTime}`}</Text>
        <Text style={styles.text}>{`Get time from Watermelon: ${getTime}`}</Text>
        <Text></Text>
        <Text style={styles.text}>{`Download time to SQLite: ${downloadSQLiteBETime}`}</Text>
        <Text style={styles.text}>{`Save time to SQLite: ${saveSQLiteDBTime}`}</Text>
        <Text style={styles.text}>{`Get time from SQLite: ${getSQLiteDBTime}`}</Text>
        {/*<OrdersList />*/}
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
    deleteButton: {
        backgroundColor: 'red'
    },
    text: {
        fontSize: 18,
        lineHeight: 26,
        marginTop: 10,
    }
});
