import {ScrollView, StyleSheet, Text, View} from "react-native";
import {JSX} from "react";

import {Button} from "@/components/Button";
import {useGetPlayers, useLocalDBScreen, useOrdersSQLite, useSaveBEData} from "@/hooks";
import OrdersList from "@/app/components/OrdersList";
import PlayersList from "@/app/components/PlayersList";

export default function LocalDBScreen(): JSX.Element {
    const {getPlayers, writePlayers} = useGetPlayers();
    const {
        downloadTime,
        saveTime,
        getTime,
        hashTime,
        ramUsage,
        getDBData,
        writeDBData,
        resetDBData,
        hashAllValues
    } = useLocalDBScreen();
    const {
        downloadSQLiteBETime,
        saveSQLiteDBTime,
        getSQLiteDBTime,
        hashSQLiteTime,
        ramSQLiteUsage,
        getOrders,
        writeOrders,
        deleteOrdersDB,
        hashAllSQLiteValues,
    } = useOrdersSQLite();
    const {
        saveOrdersOneByOneTime,
        saveOrdersParallelTime,
        saveOrdersOneByOne,
        saveOrdersParallel,
        resetSaveOrdersTimes
    } = useSaveBEData();

    return <View style={styles.container}>
        <View style={styles.content}>
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
                <Button title={'Hash WaterDB data'} onPress={() => {
                    hashAllValues();
                }} style={styles.hashButton} />
            </View>
            <View style={styles.horizontal}>
                <Button title={'Get SQliteDB data'} onPress={() => {
                    getOrders();
                }} style={styles.getButton} />
                <Button title={'Write SQliteDB data'} onPress={() => {
                    writeOrders();
                }} style={styles.writeButton} />
                <Button title={'Hash SQliteDB data'} onPress={() => {
                    hashAllSQLiteValues();
                }} style={styles.hashButton} />
            </View>
            <View style={styles.horizontal}>
                <Button title={'Save DB data one by one'} onPress={() => {
                    saveOrdersOneByOne();
                }} style={styles.saveButton} />
            </View>
            <View style={styles.horizontal}>
                <Button title={'Save DB data parallel'} onPress={() => {
                    saveOrdersParallel();
                }} style={styles.saveButton} />
            </View>
            <ScrollView contentContainerStyle={{paddingBottom: 10}}>
                <Text style={styles.text}>{`Download time to Watermelon: ${downloadTime}`}</Text>
                <Text style={styles.text}>{`Save time to Watermelon: ${saveTime}`}</Text>
                <Text style={styles.text}>{`Get time from Watermelon: ${getTime}`}</Text>
                <Text style={styles.text}>{`Hash Watermelon Time: ${hashTime}`}</Text>
                <Text style={styles.text}>{`RAM Watermelon usage: ${ramUsage}`}</Text>
                <Text></Text>
                <Text style={styles.text}>{`Download time to SQLite: ${downloadSQLiteBETime}`}</Text>
                <Text style={styles.text}>{`Save time to SQLite: ${saveSQLiteDBTime}`}</Text>
                <Text style={styles.text}>{`Get time from SQLite: ${getSQLiteDBTime}`}</Text>
                <Text style={styles.text}>{`Hash SQLite Time: ${hashSQLiteTime}`}</Text>
                <Text style={styles.text}>{`RAM SQLite usage: ${ramSQLiteUsage}`}</Text>
                <Text></Text>
                <Text style={styles.text}>{`Save one by one data time: ${saveOrdersOneByOneTime}`}</Text>
                <Text style={styles.text}>{`Save parallel data time: ${saveOrdersParallelTime}`}</Text>
                {/*<OrdersList />*/}
            </ScrollView>
        </View>
        <View style={styles.horizontal}>
            <Button title={'Reset DB data'} onPress={() => {
                resetDBData();
                deleteOrdersDB();
                resetSaveOrdersTimes();
            }} style={styles.deleteButton} />
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    content: {
        flex: 1,
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
    saveButton: {
        backgroundColor: 'orange'
    },
    hashButton: {
        backgroundColor: 'violet'
    },
    writeButton: {
        backgroundColor: 'green'
    },
    deleteButton: {
        backgroundColor: 'red'
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
        marginTop: 10,
    }
});
