import {ScrollView, StyleSheet, Text, View} from "react-native";
import {JSX} from "react";

import {Button} from "@/components/Button";
import {useOrdersSQLite} from "@/hooks";
import {getTimeString} from "@/utils";

export default function SQLiteDBScreen(): JSX.Element {
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

    return <View style={styles.container}>
        <View style={styles.content}>
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
            <ScrollView contentContainerStyle={{paddingBottom: 10}}>
                <Text style={styles.text}>
                    {`Download time to SQLite: ${getTimeString(downloadSQLiteBETime)}`}
                </Text>
                <Text style={styles.text}>
                    {`Save time to SQLite: ${getTimeString(saveSQLiteDBTime)}`}
                </Text>
                <Text style={styles.text}>
                    {`Get time from SQLite: ${getTimeString(getSQLiteDBTime)}`}
                </Text>
                <Text style={styles.text}>
                    {`Hash SQLite Time: ${getTimeString(hashSQLiteTime)}`}
                </Text>
                <Text style={styles.text}>
                    {`RAM SQLite usage: ${ramSQLiteUsage}MB`}
                </Text>
            </ScrollView>
        </View>
        <View style={styles.horizontal}>
            <Button
                title={'Reset DB data'}
                onPress={deleteOrdersDB}
                style={styles.deleteButton}
            />
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
        borderBottomWidth: 1,
    }
});
