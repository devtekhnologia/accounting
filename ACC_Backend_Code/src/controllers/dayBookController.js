const { getAllTransactionsByFirmId } = require('../models/paymentModel');
const { getReceiptsByFirmId } = require('../models/receiptModel');
const { getFirmsByUserId } = require('../models/dayBookModel');

const dayBookHandler = async (req, res) => {
  try {
    const { firm_id, user_id, startDate, endDate } = req.body;

    let allTransactions = [];

    if (firm_id) {
      // Fetch payment transactions
      const paymentTransactions = await getAllTransactionsByFirmId(firm_id, startDate, endDate);

      // Fetch receipt transactions
      const receiptTransactions = await getReceiptsByFirmId(firm_id, startDate, endDate);

      // Add transaction type property
      const formattedPayments = paymentTransactions.map(transaction => ({ ...transaction, type: 'payment' }));
      const formattedReceipts = receiptTransactions.map(transaction => ({ ...transaction, type: 'receipt' }));

      // Merge transactions
      allTransactions = [...formattedPayments, ...formattedReceipts];
    } else if (user_id) {
      // Fetch all firms for the user
      const firms = await getFirmsByUserId(user_id);
      const firmIds = firms.map(firm => firm.firm_id);

      if (firmIds.length === 0) {
        return res.status(404).json({ status: false, message: "No firms found for the given user" });
      }

      // Fetch payment transactions and receipt transactions for all firms
      for (const id of firmIds) {
        const paymentTransactions = await getAllTransactionsByFirmId(id, startDate, endDate);
        const receiptTransactions = await getReceiptsByFirmId(id, startDate, endDate);

        // Add transaction type property
        const formattedPayments = paymentTransactions.map(transaction => ({ ...transaction, type: 'payment' }));
        const formattedReceipts = receiptTransactions.map(transaction => ({ ...transaction, type: 'receipt' }));

        // Merge transactions
        allTransactions.push(...formattedPayments, ...formattedReceipts);
      }
    } else {
      return res.status(400).json({ status: false, message: "Either firm_id or user_id is required" });
    }

    // Remove duplicates based on transaction_id
    const uniqueTransactions = Array.from(new Map(allTransactions.map(item => [item.transaction_id, item])).values());

    // Sort transactions by transaction_date in descending order
    uniqueTransactions.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

    res.status(200).send({ status: true, data: uniqueTransactions });
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { dayBookHandler };
