import {StyleSheet, View} from "react-native";
import {JSX} from "react";

import {Button} from "@/components/Button";

export default function LocalDBScreen(): JSX.Element {
    return <View style={styles.container}>
        <View style={styles.horizontal}>
            <Button title={'Get DB data'} onPress={() => {}} />
            <Button title={'Get DB data'} onPress={() => {}} />
        </View>
        <View style={styles.horizontal}>
            <Button title={'Get DB data'} onPress={() => {}} />
            <Button title={'Get DB data'} onPress={() => {}} />
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
