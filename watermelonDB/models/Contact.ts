import {Collection, Model} from '@nozbe/watermelondb'
import {text, children} from '@nozbe/watermelondb/decorators';

import {OrderContact} from "@/watermelonDB/models/index";

export default class Contact extends Model {
    static table = 'contacts';

    static associations = {
        order_contacts: { type: 'has_many', foreignKey: 'contact_id' },
    } as const

    @text('full_name') fullName!: string;
    @text('email') email!: string;
    @text('phone') phone!: string;
    @text('company') company!: string;

    @children('order_contacts') orderContacts!: Collection<OrderContact>;
}