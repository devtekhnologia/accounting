const { getAllTransactionsByFirmIdAndGlId } = require('../models/ledgerReportModel');
const { getReceiptsByFirmIdAndGlId } = require('../models/ledgerReportModel');

const getLedgerReportHandler = async (req, res) => {
  try {
    const { firm_id, gl_id } = req.params; // Added gl_id
    const { startDate, endDate } = req.query;

    // Fetch payment transactions for the specific ledger
    const paymentTransactions = await getAllTransactionsByFirmIdAndGlId(firm_id, gl_id, startDate, endDate);

    // Fetch receipt transactions for the specific ledger
    const receiptTransactions = await getReceiptsByFirmIdAndGlId(firm_id, gl_id, startDate, endDate);

    // Add transaction type property
    const formattedPayments = paymentTransactions.map(transaction => ({ ...transaction, type: 'payment' }));
    const formattedReceipts = receiptTransactions.map(transaction => ({ ...transaction, type: 'receipt' }));

    // Merge transactions
    const allTransactions = [...formattedPayments, ...formattedReceipts];

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

module.exports = { getLedgerReportHandler };
