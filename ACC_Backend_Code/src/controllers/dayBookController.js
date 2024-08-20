const { getAllTransactionsByFirmId } = require('../models/paymentModel');
const { getReceiptsByFirmId } = require('../models/receiptModel');
const { getFirmIdsByUserId } = require('../models/dayBookModel'); // Assuming you have a model to fetch firm_ids by user_id

const dayBookHandler = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { startDate, endDate } = req.query;
    console.log(user_id);

    // // If startDate and endDate are not provided, set them to today's date
    // if (!startDate || !endDate) {
    //   const today = new Date().toISOString().slice(0, 10);
    //   startDate = today;
    //   endDate = today;
    // }

    // Fetch all firm_ids associated with the given user_id
    const firmIdRows = await getFirmIdsByUserId(user_id);
    console.log(firmIdRows);

    // Extract firm_id from each row
    const firmIds = firmIdRows.map(row => row.firm_id);
    console.log(firmIds);
    let allTransactions = [];

    // Fetch transactions for each firm_id
    for (const firm_id of firmIds) {
      console.log(firm_id);
      const paymentTransactions = await getAllTransactionsByFirmId(firm_id, startDate, endDate);
      const receiptTransactions = await getReceiptsByFirmId(firm_id, startDate, endDate);

      // console.log(paymentTransactions);
      // console.log(receiptTransactions);

      const formattedPayments = paymentTransactions.map(transaction => ({ ...transaction, type: 'payment' }));
      const formattedReceipts = receiptTransactions.map(transaction => ({ ...transaction, type: 'receipt' }));

      console.log(formattedPayments);
      console.log(formattedReceipts);
      
      allTransactions = [...allTransactions, ...formattedPayments, ...formattedReceipts];
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
