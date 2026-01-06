import {ReactElement} from 'react';
import {StyleSheet, Text, View} from "react-native";

export default function DetailsScreen(): ReactElement {
    return <View style={styles.container}>
        <Text>Details</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
    },
});
