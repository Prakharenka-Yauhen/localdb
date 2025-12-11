import { Model } from '@nozbe/watermelondb'
import { text, date, children } from '@nozbe/watermelondb/decorators'

export default class ContractAgreement extends Model {
    static table = 'contract_agreements';

    @text('contract_id') contractId
    @text('title') title
    @text('signed_date') signedDate
}