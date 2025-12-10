import { Model } from '@nozbe/watermelondb'
import {text, field} from '@nozbe/watermelondb/decorators';

export default class Player extends Model {
    static table = 'players'

    @field('age') age: number;
    @text('player_name') playerName: string;
    @text('position') position: string;
}