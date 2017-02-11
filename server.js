'use strict';

var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var morgan          = require('morgan');

var jwt             = require('express-jwt');
var cors            = require('cors');

var mongoose        = require('mongoose');
mongoose.Promise    = require('bluebird');

var BankAccount     = require('./app/models/bankaccount');
var Transaction     = require('./app/models/transaction');

var config          = require('./config');                      // get our config file

mongoose.connect(config.database);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(cors());

const authCheck = jwt({
    secret: new Buffer('_bDGfwphWOS-gw9HIDBclwnPprAMCjwdsc_ItSDPFB6IvAx8VMuUpW74knrr8hLe', 'base64'),
    audience: 'hf5glZUDFOTDFJXJHJHUuA0D5GDOZ43O'
});

var port = process.env.PORT || 8008;

// ROUTES FOR OUR API
//================================================
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER THE ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

//  Route	                                HTTP Verb	Description
//  /api/bankaccounts	                    GET	        Get all the BankAccount.
//  /api/bankaccounts	                    POST	    Create a BankAccount.
//  /api/bankaccounts/:bankaccount_id	    GET	        Get a single BankAccount.
//  /api/bankaccounts/:bankaccount_id	    PUT	        Update a BankAccount with new info.
//  /api/bankaccounts/:bankaccount_id	    DELETE	    Delete a BankAccount.

// on routes that end in /bankaccounts
// ----------------------------------------------------
router.route('/bankaccounts')
    .post(function(req, res) {

        console.log("body: " + req.body.iban + "/" + req.body.holderName);

        var bankAccount = new BankAccount();            // create a new instance of the Bank Account model
        bankAccount.iban        = req.body.iban;               // set the Bank Account name (comes from the request)
        bankAccount.holderName  = req.body.holderName;
        bankAccount.bankName    = req.body.bankName;
        bankAccount.country     = req.body.country;

        // save the bear and check for errors
        bankAccount.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bank Account created !' });
        });

    })

    .get(function(req, res) {
        BankAccount.find(function(err, bankAccounts) {
            if (err)
                res.send(err);

            res.json(bankAccounts);
        });
    });

// on routes that end in /bankaccounts/:bankaccount_id
// ----------------------------------------------------
router.route('/bankaccounts/:bankAccount_id')

// get the bear with that id (accessed at GET http://localhost:8080/api/bankaccounts/:iban)
    .get(function(req, res) {
        BankAccount.find({iban: req.params.bankAccount_id} , function(err, bankAccount) {
            if (err)
                res.send(err);
            res.json(bankAccount);
        });
    })

    .put(function(req, res) {

        // use our BankAccount model to find the BankAccount we want
        BankAccount.findById(req.params.bankAccount_id, function(err, bankAccount) {

            if (err)
                res.send(err);

            bankAccount.iban        = req.body.iban;               // update the BankAccount info
            bankAccount.holderName  = req.body.holderName;
            bankAccount.bankName    = req.body.bankName;
            bankAccount.country     = req.body.country;

            // save the BankAccount
            bankAccount.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bank Account updated!' });
            });

        });
    })

    .delete(function(req, res) {
        BankAccount.remove({_id: req.params.bankAccount_id}, function(err, bankAccount) {
            if (err)
                res.send(err);

            res.json({ message: 'Bank Account Successfully deleted' });
        });
    });

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port ' + port + ' ... ');
