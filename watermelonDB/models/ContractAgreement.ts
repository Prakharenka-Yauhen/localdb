import { Model } from '@nozbe/watermelondb'
import { text } from '@nozbe/watermelondb/decorators'

export default class ContractAgreement extends Model {
    static table = 'contract_agreements';

    @text('contract_id') contractId!: string;
    @text('title') title!: string;
    @text('signed_date') signedDate!: string;
}