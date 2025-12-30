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

    const getTimeString = (time: number): string => {
        return `${(time/1000).toFixed(3)}sec (${(time/60000).toFixed(2)}min)`
    }

    return <View style={styles.container}>
        <View style={styles.content}>
            {/*<View style={styles.horizontal}>*/}
            {/*    <Button title={'Get sport data'} onPress={getPlayers} style={styles.getButton} />*/}
            {/*    <Button title={'Write sport data'} onPress={writePlayers} style={styles.writeButton} />*/}
            {/*</View>*/}
            {/*<PlayersList />*/}
            <View style={styles.horizontal}>
                <Button title={'Write WaterDB data'} onPress={() => {
                    writeDBData();
                }} style={styles.writeButton} />
                <Button title={'Get WaterDB data'} onPress={() => {
                    getDBData();
                }} style={styles.getButton} />
                <Button title={'Hash WaterDB data'} onPress={() => {
                    hashAllValues();
                }} style={styles.hashButton} />
            </View>
            <View style={styles.horizontal}>
                <Button title={'Write SQliteDB data'} onPress={() => {
                    writeOrders();
                }} style={styles.writeButton} />
                <Button title={'Get SQliteDB data'} onPress={() => {
                    getOrders();
                }} style={styles.getButton} />
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
                <Text style={styles.text}>{`Download time to Watermelon: ${getTimeString(downloadTime)}`}</Text>
                <Text style={styles.text}>{`Save time to Watermelon: ${getTimeString(saveTime)}`}</Text>
                <Text style={styles.text}>{`Get time from Watermelon: ${getTimeString(getTime)}`}</Text>
                <Text style={styles.text}>{`Hash Watermelon Time: ${getTimeString(hashTime)}`}</Text>
                <Text style={styles.text}>{`RAM Watermelon usage: ${ramUsage}MB`}</Text>
                <View style={styles.line} />
                <Text style={styles.text}>{`Download time to SQLite: ${getTimeString(downloadSQLiteBETime)}`}</Text>
                <Text style={styles.text}>{`Save time to SQLite: ${getTimeString(saveSQLiteDBTime)}`}</Text>
                <Text style={styles.text}>{`Get time from SQLite: ${getTimeString(getSQLiteDBTime)}`}</Text>
                <Text style={styles.text}>{`Hash SQLite Time: ${getTimeString(hashSQLiteTime)}`}</Text>
                <Text style={styles.text}>{`RAM SQLite usage: ${ramSQLiteUsage}MB`}</Text>
                <View style={styles.line} />
                <Text style={styles.text}>{`Save one by one data time: ${getTimeString(saveOrdersOneByOneTime)}`}</Text>
                <Text style={styles.text}>{`Save parallel data time: ${getTimeString(saveOrdersParallelTime)}`}</Text>
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
        gap: 5,
        marginBottom: 5,
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
        fontSize: 14,
        lineHeight: 16,
        marginTop: 10,
    },
    line: {
        height: 1,
        backgroundColor: 'black',
        marginTop: 5,
    }
});
