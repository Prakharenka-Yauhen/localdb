import {useCallback} from "react";
import axios from "axios";
import { Q } from '@nozbe/watermelondb'

import {database, playersCollection} from "@/watermelonDB";
import {Player} from "@/watermelonDB/models";

type PlayerProps = {
    age: number;
    playerName: string;
    position: string;
}

type UseGetPlayersProps = {
    getPlayers: () => Promise<void>;
    writePlayers: () => Promise<void>;
    deletePlayers: (post: Player) => void;
}

export const useGetPlayers = (): UseGetPlayersProps => {
    const getPlayers = useCallback(async (): Promise<void> => {
        await playersCollection.query(Q.sortBy('player_name', 'asc')).fetch();
    }, []);

    // https://documenter.getpostman.com/view/25652688/2sB34Zs4xZ
    const api: string = "https://api.server.nbaapi.com/api/playertotals?season=2025&team=CHI&page=1&pageSize=35&isPlayoff=False";
    const writePlayers = useCallback(async (): Promise<void> => {
        try {
            const response = await axios.get(api);
            if (response.status === 200) {
                const existingPlayers: Player[] = await playersCollection.query(Q.sortBy('player_name', 'asc')).fetch();
                const existingIds = new Set(existingPlayers.map((player: Player): string => player.playerName));

                const responsePlayers: any[] = response.data.data;
                const newPlayers: any[] = responsePlayers.filter((player: any): boolean => !existingIds.has(player.playerName));

                const batchNewPlayers: Player[] = newPlayers.map((user: PlayerProps): Player => {
                    return playersCollection.prepareCreate((player: Player): void => {
                        player.age = user.age;
                        player.playerName = user.playerName;
                        player.position = user.position;
                    })
                })
                const batchUpdatingPlayers: Player[] = existingPlayers.map((user: Player): Player => {
                    return user.prepareUpdate((player: Player): void => {
                        player.age = user.age;
                        player.playerName = user.playerName;
                        player.position = user.position;
                    })
                })

                await database.write(async (): Promise<void> => {
                    await database.batch(...batchNewPlayers, ...batchUpdatingPlayers)
                });
            } else {
                console.log("Error fetching players:", response.data);
            }
        } catch (error) {
            console.log("Error fetching players:", error);
        }
    }, []);

    const deletePlayers = useCallback(async (post: Player): Promise<void> => {
        await database.write(async (): Promise<void> => {
            await post.destroyPermanently();
        });
    }, []);

    return {getPlayers, writePlayers, deletePlayers};
};
