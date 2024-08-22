const { createReceiptTransaction, getReceiptsByFirmId } = require('../models/receiptModel');

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

module.exports = { createReceipt, getReceiptsByFirm };
