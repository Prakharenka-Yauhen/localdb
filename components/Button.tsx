import {JSX} from "react";
import {Pressable, StyleSheet, Text, ViewStyle} from "react-native";

type ButtonProps = {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
}

export const Button = ({title, onPress, style}: ButtonProps): JSX.Element => {
    return <Pressable onPress={onPress} style={[styles.container, style]} >
        <Text style={styles.title}>{title}</Text>
    </Pressable>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 10,
    },
    title: {
        color: 'white',
    }
});
