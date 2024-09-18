const { getAllTransactionsByFirmIdAndGlId } = require('../models/ledgerReportModel');
const { getReceiptsByFirmIdAndGlId } = require('../models/ledgerReportModel');
const { getFirmAndCash_GeneralLedgerPairsDirectHandler } = require('./firmGenLedPairController');

const getCashReportHandler = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { startDate, endDate } = req.query;
    console.log(user_id);

    const cash_FirmLegderPair = await getFirmAndCash_GeneralLedgerPairsDirectHandler(user_id);

    let allTransactions = []; // Initialize allTransactions

    // Fetch transactions for each firm_id and gl_id pair
    for (const { firm_id, gl_id } of cash_FirmLegderPair) {
      console.log(firm_id, gl_id);

      // Fetch payment transactions for the specific ledger
      const paymentTransactions = await getAllTransactionsByFirmIdAndGlId(firm_id, gl_id, startDate, endDate);

      // Fetch receipt transactions for the specific ledger
      const receiptTransactions = await getReceiptsByFirmIdAndGlId(firm_id, gl_id, startDate, endDate);

      // Add transaction type property
      const formattedPayments = paymentTransactions.map(transaction => ({ ...transaction, type: 'payment' }));
      const formattedReceipts = receiptTransactions.map(transaction => ({ ...transaction, type: 'receipt' }));

      // Merge transactions
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

module.exports = { getCashReportHandler };
