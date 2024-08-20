const express = require('express');
const userController = require('../controllers/userController');
const firmController = require('../controllers/firmController');

const geneLedgerController = require('../controllers/geneLedController');
const paymentController = require('../controllers/paymentController');
const receiptController = require('../controllers/receiptController');
const firmAllTransactionsController = require('../controllers/firmAllTransactionsController');
const dayBookController = require('../controllers/dayBookController');

const publicRoutes = express.Router();

const protectedRoutes = express.Router();

// Public routes
publicRoutes.post('/register', userController.registerYourself);
publicRoutes.post('/login', userController.loginUserHandler);


// APIs for Users
publicRoutes.post('/add_user', userController.addUserHandler);
publicRoutes.get('/user_details/:user_id', userController.userDetailsHandler);
publicRoutes.put('/update_user_details/:user_id', userController.updateUserDetailsHandler);
publicRoutes.delete('/delete_user/:user_id', userController.deleteUserHandler);
publicRoutes.post('/assign_firm_to_user', userController.assignFirmToUserHandler);
publicRoutes.get('/show_firm_user/:uf_id', userController.firmUserHandler);
publicRoutes.put('/update_firm_user/:uf_id', userController.updateFirmUserHandler);
publicRoutes.delete('/delete_firm_user/:uf_id', userController.deleteFirmUserHandler);
publicRoutes.get('/users_added_by_user/:user_id', userController.usersAddedByUserHandler);



// APIs for firms
publicRoutes.post('/create_firm/:user_id', firmController.createFirmHandler);
publicRoutes.get('/get_firm_details/:firm_id', firmController.getFirmHandler);
publicRoutes.get('/get_all_firms', firmController.getAllFirmsHandler);
publicRoutes.get('/get_all_firms_by_user/:user_id', firmController.getFirmsByUserHandler);
publicRoutes.get('/get_all_firms_by_adding_user/:user_id', firmController.getFirmsByAddingUserHandler);
publicRoutes.put('/update_firm_details/:firm_id', firmController.updateFirmHandler);
publicRoutes.delete('/delete_firm/:firm_id', firmController.deleteFirmHandler);
publicRoutes.get('/total_bal_of_all_firms/:user_id', firmController.getTotalBalanceByUserHandler);



// // APIs for firms_users
// publicRoutes.post('/assign_firm_to_user', userController.assign_firm_to_user);
// publicRoutes.get('/firm_user/:uf_id', userController.firm_user);
// publicRoutes.put('/update_firm_user/:uf_id', userController.update_firm_user);
// publicRoutes.delete('/delete_firm_user/:uf_id', userController.delete_firm_user);


// // APIs for General_Ledgers
publicRoutes.post('/create_general_ledgers/:firm_id', geneLedgerController.createGeneralLedgerHandler);
publicRoutes.get('/get_general_ledgers/:firm_id', geneLedgerController.getGeneralLedgersHandler);
publicRoutes.put('/update_general_ledgers/:firm_id/:gl_id', geneLedgerController.updateGeneralLedgerHandler);
publicRoutes.delete('/delete_general_ledgers/:firm_id/:gl_id', geneLedgerController.deleteGeneralLedgerHandler);


// // APIs for Payment
publicRoutes.post('/payment/:user_id', paymentController.createPaymentHandler );
publicRoutes.get('/show_payment_transac/:from_firm_id', paymentController.getTransactionsByFirmIdHandler );
publicRoutes.get('/show_payment_details/:transaction_id', paymentController.getPaymentHandler);
publicRoutes.get('/firm_total_bal/:firm_id', paymentController.getTotalBalanceByFirmIdHandler);


// // APIs for Receipt

publicRoutes.post('/receipt/:user_id', receiptController.createReceipt);
publicRoutes.get('/show_receipt_transactions/:to_firm_id', receiptController.getReceiptsByFirm);
// publicRoutes.put('/update_sub_ledgers/:lgr_id', userController.update_sub_ledgers);
// publicRoutes.delete('/delete_sub_ledgers/:lgr_id', userController.delete_sub_ledgers);
publicRoutes.get('/show_firm_all_transactions/:firm_id/transactions', firmAllTransactionsController.getAllFirmTransactionsHandler);
// publicRoutes.get('/show_day_book_transactions/:firm_id', dayBookController.dayBookHandler);
publicRoutes.get('/show_day_book_transactions/:user_id', dayBookController.dayBookHandler);


// publicRoutes.post('/create_transactions', createTransaction);
// publicRoutes.get('/fetch_transactions/:firm_id', getTransactions);
// publicRoutes.put('/update_transactions/:transaction_id', updateTransaction);
// publicRoutes.delete('delete_/transactions/:transaction_id', deleteTransaction);


// Protected routes
// protectedRoutes.get('/', userController.getAllUsers);
// protectedRoutes.post('/create', userController.createUser);

module.exports = { publicRoutes, protectedRoutes };
