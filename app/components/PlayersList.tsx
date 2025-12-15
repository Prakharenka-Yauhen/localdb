import {JSX, useCallback} from "react";
import {FlatList, ListRenderItemInfo} from "react-native";
import {withObservables} from "@nozbe/watermelondb/react";

import {playersCollection} from "@/watermelonDB";
import {Player} from "@/watermelonDB/models";
import PlayerListItem from "@/app/components/PlayerListItem";

type PlayersListProps = {
    players: Player[];
}

const PlayersList = ({players}: PlayersListProps): JSX.Element => {
    const renderItem = useCallback(({item}: ListRenderItemInfo<Player>): JSX.Element => {
        return <PlayerListItem player={item} />
    }, [])

    return <FlatList data={players} renderItem={renderItem} style={{flex: 1}} />
}

const enhance = withObservables([], () => ({
    players: playersCollection.query(),
}))

export default enhance(PlayersList);
