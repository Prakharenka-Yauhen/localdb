import {StyleSheet, View} from "react-native";
import {JSX} from "react";

import {Button} from "@/components/Button";
import {useGetPlayers, useLocalDBScreen} from "@/hooks";
import OrdersList from "@/app/components/OrdersList";
import PlayersList from "@/app/components/PlayersList";

export default function LocalDBScreen(): JSX.Element {
    const {getPlayers, writePlayers} = useGetPlayers();
    const {getDBData, writeDBData, resetDBData} = useLocalDBScreen();

    return <View style={styles.container}>
        <View style={styles.horizontal}>
            <Button title={'Get sport data'} onPress={getPlayers} style={styles.getButton} />
            <Button title={'Write sport data'} onPress={writePlayers} style={styles.writeButton} />
        </View>
        <View style={styles.horizontal}>
            <Button title={'Get DB data'} onPress={getDBData} style={styles.getButton} />
            <Button title={'Write DB data'} onPress={writeDBData} style={styles.writeButton} />
        </View>
        <View style={styles.horizontal}>
            <Button title={'Reset DB data'} onPress={resetDBData} style={styles.deleteButton} />
        </View>
        {/*<PlayersList />*/}
        <OrdersList />
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
});
