import { Model } from '@nozbe/watermelondb'
import {text, field} from '@nozbe/watermelondb/decorators';

export default class Contact extends Model {
    static table = 'contacts'

    @text('title') title: string;
    @text('subtitle') subtitle: string;
    @text('body') body: string;
    @field('is_pinned') isPinned: boolean;
}