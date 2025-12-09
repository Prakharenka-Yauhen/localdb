import {StyleSheet, View} from "react-native";
import {JSX} from "react";

import {Button} from "@/components/Button";
import {useLocalDBScreen} from "@/hooks/useLocalDBScreen";

export default function LocalDBScreen(): JSX.Element {
    const {getDBData, writeDBData, updateDBData, deleteDBData} = useLocalDBScreen();

    return <View style={styles.container}>
        <View style={styles.horizontal}>
            <Button title={'Get DB data'} onPress={getDBData} style={{backgroundColor: 'blue'}} />
            <Button title={'Write DB data'} onPress={writeDBData} style={{backgroundColor: 'green'}} />
        </View>
        <View style={styles.horizontal}>
            <Button title={'Update DB data'} onPress={updateDBData} style={{backgroundColor: 'orange'}} />
            <Button title={'Delete DB data'} onPress={deleteDBData} style={{backgroundColor: 'red'}} />
        </View>
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
    }
});
