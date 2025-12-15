import {createTable, schemaMigrations} from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
    migrations: [
        // {
        //     toVersion: 2,
        //     steps: [
        //         createTable({
        //             name: 'players',
        //             columns: [
        //                 { name: 'age', type: 'number' },
        //                 { name: 'player_name', type: 'string' },
        //                 { name: 'position', type: 'string' },
        //             ]
        //         }),
        //     ],
        // }
    ],
})