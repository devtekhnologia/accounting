const { createReceiptTransaction, getReceiptsByFirmId } = require('../models/receiptModel');
const { dayBookHandler } = require('./dayBookController');


const createReceipt = async (req, res) => {
  try {
    const { to_firm_id, to_gl_id, from_firm_id, from_gl_id, amount, remark, trans_type, transaction_date } = req.body;
    const { user_id } = req.params;

    if (!to_firm_id || !to_gl_id || !from_firm_id || !from_gl_id || !user_id || !amount || !transaction_date) {
      return res.status(400).send({ status: false, message: "All fields are required" });
    }

    // Create a new transaction
    const transactionId = await createReceiptTransaction(to_firm_id, to_gl_id, from_firm_id, from_gl_id, user_id, amount, remark, trans_type, transaction_date);

    res.status(201).send({ status: true, data: transactionId, message: 'Receipt transaction created successfully' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const getReceiptsByFirm = async (req, res) => {
  try {
    const { to_firm_id } = req.params;
    const { startDate, endDate } = req.query;
    console.log('Received startDate:', startDate);
    console.log('Received endDate:', endDate);

    const transactions = await getReceiptsByFirmId(to_firm_id, startDate, endDate);

    if (!transactions || transactions.length === 0) {
      return res.status(404).send({ status: false, message: "No transactions found for this firm" });
    }

    res.status(200).send({ status: true, data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send({ status: false, message: error.message });
  }
};



const getTotalReceiptAmtHandler = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Simulate calling dayBookHandler, capture the response manually
    const all_transactions = await new Promise((resolve, reject) => {
      dayBookHandler(
        { params: { user_id }, query: {} },
        { 
          status: (statusCode) => ({
            send: (data) => resolve({ statusCode, data })
          })
        }
      );
    });
    
    // Handle the response from dayBookHandler
    if (all_transactions.statusCode === 200 && all_transactions.data.status === true) {
      const transactions = all_transactions.data.data;

      // Filter and sum the payments
      const receiptTotal = transactions
        .filter(transaction => transaction.trans_type === 'receipt') // Filter for payment transactions
        .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0); // Sum the amounts

      console.log(`Total Payment Amount: ${receiptTotal}`);
      res.status(200).send({ status: true, data: receiptTotal });
    } else {
      throw new Error("Invalid response or no data found.");
    }
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).send({ status: false, message: error.message });
  }
};



module.exports = { createReceipt, getReceiptsByFirm, getTotalReceiptAmtHandler };
