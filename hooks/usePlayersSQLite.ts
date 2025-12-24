import {useCallback, useEffect, useState} from "react";
import {SQLiteDatabase} from "expo-sqlite";
import axios from "axios";

import {getDB} from "@/sqliteDB";

type PlayerProps = {
    playerId: string;
    age: number;
    playerName: string;
    position: string;
}

type UsePlayersSQLiteProps= {
    players: PlayerProps[];
    getPlayers: () => Promise<void>;
    writePlayers: () => Promise<void>;
    deletePlayersDB: () => Promise<void>;
}

export const usePlayersSQLite = (): UsePlayersSQLiteProps => {
    const [players, setPlayers] = useState<PlayerProps[]>([]);

    const createPlayersDB = useCallback(async (): Promise<void> => {
        const db: SQLiteDatabase = await getDB();

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS PLAYERS (
               id TEXT PRIMARY KEY,
               age INTEGER NOT NULL,
               player_name TEXT NOT NULL,
               player_position TEXT NOT NULL
            )
      `);
    }, []);

    const getPlayers = useCallback(async (): Promise<void> => {
        const db: SQLiteDatabase = await getDB();
        const playersDB: PlayerProps[] = await db.getAllAsync(
            `SELECT * FROM PLAYERS ORDER BY player_name ASC`
        );
        setPlayers(playersDB);
        // const schema = await db.getAllAsync("PRAGMA table_info(PLAYERS);");
    }, []);

    // https://documenter.getpostman.com/view/25652688/2sB34Zs4xZ
    const api: string = "https://api.server.nbaapi.com/api/playertotals?season=2025&team=CHI&page=1&pageSize=35&isPlayoff=False";
    const writePlayers = useCallback(async (): Promise<void> => {
        try {
            const response = await axios.get(api);
            if (response.status === 200) {
                const responsePlayers: any[] = response.data.data;
                const db: SQLiteDatabase = await getDB();

                responsePlayers.forEach((player: PlayerProps): void => {
                    console.log(111)
                    try {
                        db.runAsync(
                            `INSERT OR REPLACE INTO PLAYERS (id, age, player_name, player_position) VALUES (?, ?, ?, ?)`,
                            [player.playerId, player.age, player.playerName, player.position]
                        )
                    } catch (error) {
                        console.log(444)
                        console.log(error)
                    }
                })
            } else {
                console.log("Error fetching players:", response.data);
            }
        } catch (error) {
            console.log("Error fetching players:", error);
        }
    }, []);

    const deletePlayersDB = useCallback(async (): Promise<void> => {
        const db: SQLiteDatabase = await getDB();
        await db.execAsync(`
          DROP TABLE IF EXISTS PLAYERS;
        `);
        // await db.closeAsync();
        // await deleteDatabaseAsync(DB_NAME);
    }, []);

    useEffect(() => {
        createPlayersDB().catch((e: Error): void => console.log(e));
    }, []);

    return {players, getPlayers, writePlayers, deletePlayersDB}
}