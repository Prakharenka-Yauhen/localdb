import {StyleSheet, View} from "react-native";
import {JSX} from "react";

import {Button} from "@/components/Button";
import {useLocalDBScreen} from "@/hooks/useLocalDBScreen";
import OrdersList from "@/app/components/OrdersList";

export default function LocalDBScreen(): JSX.Element {
    const {getDBData, writeDBData} = useLocalDBScreen();

    return <View style={styles.container}>
        <View style={styles.horizontal}>
            <Button title={'Get DB data'} onPress={getDBData} style={styles.getButton} />
            <Button title={'Write DB data'} onPress={writeDBData} style={styles.writeButton} />
        </View>
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
    }
});
