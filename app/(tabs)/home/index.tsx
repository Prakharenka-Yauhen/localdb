import {ReactElement} from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";

import {Button} from "@/components/Button";
import {useGetPlayers, useLocalDBScreen} from "@/hooks";
import OrdersList from "@/app/components/OrdersList";
import PlayersList from "@/app/components/PlayersList";
import {getTimeString} from "@/utils";
import {useRouter} from "expo-router";

export default function LocalDBScreen(): ReactElement {
    const router = useRouter();
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
            <ScrollView contentContainerStyle={{paddingBottom: 10}}>
                <Text style={styles.text}>
                    {`Download time to WM: ${getTimeString(downloadTime)}`}
                </Text>
                <Text style={styles.text}>
                    {`Save time to WM: ${getTimeString(saveTime)}`}
                </Text>
                <Text style={styles.text}>
                    {`Get time from WM: ${getTimeString(getTime)}`}
                </Text>
                <Text style={styles.text}>
                    {`Hash WM Time: ${getTimeString(hashTime)}`}
                </Text>
                <Text style={styles.text}>
                    {`RAM WM usage: ${ramUsage}MB`}
                </Text>
                {/*<OrdersList />*/}
            </ScrollView>
        </View>
        <View style={styles.horizontal}>
        <Button
            title={'Watch details'}
            onPress={() => router.push('/home/details')}
        />
        </View>
        <View style={styles.horizontal}>
            <Button
                title={'Log out'}
                onPress={() => router.replace('/(login)')}
            />
        </View>
        <View style={styles.horizontal}>
            <Button
                title={'Reset DB data'}
                onPress={resetDBData}
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
