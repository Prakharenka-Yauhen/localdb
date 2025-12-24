import {openDatabaseAsync, SQLiteDatabase} from "expo-sqlite";

export const DB_NAME = "sql_db";

let db: SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLiteDatabase> {
    if (!db) {
        db = await openDatabaseAsync(DB_NAME);
    }
    return db;
}
