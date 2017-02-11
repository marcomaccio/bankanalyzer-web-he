var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BankAccountSchema   = new Schema({

    iban: String,
    holderName: String,
    bankName:   String,
    country:    String

});

var TransactionSchema = new Schema({
    iban:           String,
    valueDate:      String,
    executionDate:  String,
    description:    String,
    category:       String,
    subCategory:    String,
    debit:          Number,
    credit:         Number,
    balance:        Number,
    currency:       String
});

module.exports = mongoose.model('BankAccount', BankAccountSchema);