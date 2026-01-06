import {ReactElement} from 'react';
import {Stack} from 'expo-router';

const headerStyle: Record<string, any> = {
    headerStyle: {
        backgroundColor: 'green',
    },
    headerTitleStyle: {
        color: 'white',
    },
}

export default function HomeLayout(): ReactElement {
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                ...headerStyle,
                title: 'SQLite DB',
            }} />
        </Stack>
    );
}
