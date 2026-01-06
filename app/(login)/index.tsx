import {ReactElement} from 'react';
import {StyleSheet, View} from "react-native";

import {Button} from "@/components/Button";
import {useRouter} from "expo-router";

export default function LoginScreen(): ReactElement {
    const router = useRouter();

    return <View style={styles.container}>
        <View style={styles.horizontal}>
            <Button
                title={'Login'}
                onPress={(): void => router.replace('./(tabs)/home')}
                style={styles.loginButton}
            />
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    horizontal: {
        flexDirection: 'row',
    },
    loginButton: {
        backgroundColor: 'green'
    },
});
