import {ReactElement} from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";

import {Button} from "@/components/Button";
import {useSaveBEData} from "@/hooks";
import {getTimeString} from "@/utils";

export default function BERequestScreen(): ReactElement {
    const {
        saveOrdersOneByOneTime,
        saveOrdersParallelTime,
        saveOrdersOneByOne,
        saveOrdersParallel,
        resetSaveOrdersTimes
    } = useSaveBEData();

    return <View style={styles.container}>
        <View style={styles.content}>
            <View style={styles.horizontal}>
                <Button title={'Save DB data one by one'} onPress={() => {
                    saveOrdersOneByOne();
                }} style={styles.saveButton} />
                <Button title={'Save DB data parallel'} onPress={() => {
                    saveOrdersParallel();
                }} style={styles.saveButton} />
            </View>
            <ScrollView contentContainerStyle={{paddingBottom: 10}}>
                <Text style={styles.text}>
                    {`Save one by one data time: ${getTimeString(saveOrdersOneByOneTime)}`}
                </Text>
                <Text style={styles.text}>
                    {`Save parallel data time: ${getTimeString(saveOrdersParallelTime)}`}
                </Text>
            </ScrollView>
        </View>
        <View style={styles.horizontal}>
            <Button
                title={'Reset DB data'}
                onPress={resetSaveOrdersTimes}
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
    saveButton: {
        backgroundColor: 'orange'
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
