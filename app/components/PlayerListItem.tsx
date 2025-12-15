import {JSX} from "react";
import {StyleSheet, Text, View} from "react-native";
import {withObservables} from "@nozbe/watermelondb/react";

import {Button} from "@/components/Button";
import {Player} from "@/watermelonDB/models";
import {useGetPlayers} from "@/hooks";

type PlayerListItemProps = {
    player: Player;
}

const PlayerListItem = ({ player }: PlayerListItemProps): JSX.Element => {
    const {deletePlayers} = useGetPlayers();

    return <View style={styles.container}>
        <Text>{player.age}</Text>
        <Text>{player.playerName}</Text>
        <Text>{player.position}</Text>
        {/*<Button title={'update'} onPress={(): void => updateDBData(player)} style={styles.updateButton} />*/}
        <Button title={'delete'} onPress={(): void => deletePlayers(player)} style={styles.deleteButton} />
    </View>
}

const enhance = withObservables(['player'], ({player}: PlayerListItemProps) => ({
    player
}))

export default enhance(PlayerListItem);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
        gap: 10
    },
    updateButton: {
        backgroundColor: 'orange'
    },
    deleteButton: {
        backgroundColor: 'red'
    },
});