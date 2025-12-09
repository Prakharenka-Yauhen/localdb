import {JSX} from "react";
import {Pressable, StyleSheet, Text} from "react-native";

type ButtonProps = {
    title: string;
    onPress: () => void;
}

export const Button = ({title, onPress}: ButtonProps): JSX.Element => {
    return <Pressable onPress={onPress} style={styles.container} >
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
