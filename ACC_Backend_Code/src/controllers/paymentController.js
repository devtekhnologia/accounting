const { createPayment, getAllTransactionsByFirmId, getPaymentById, getTotalBalanceByFirmId } = require('../models/paymentModel');

const createPaymentHandler = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { from_gl_id, to_gl_id, amount, from_firm_id, to_firm_id, remark, trans_type, transaction_date } = req.body;

    // Check if required fields are provided
    if (!from_gl_id || !to_gl_id || !amount || !from_firm_id || !to_firm_id || !user_id || !transaction_date) {
      return res.status(400).send({
        status: false,
        message: "Please provide from_gl_id, to_gl_id, amount, from_firm_id, to_firm_id, user_id, and transaction_date"
      });
    }

    try {
      // Pass the transaction_date along with other parameters to createPayment
      const transactionId = await createPayment(from_gl_id, to_gl_id, from_firm_id, to_firm_id, user_id, amount, remark, trans_type, transaction_date);

      return res.status(201).send({
        status: true,
        data: { transactionId },
        message: "Payment successful"
      });
    } catch (error) {
      return res.status(400).send({
        status: false,
        message: error.message
      });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).send({
      status: false,
      message: error.message
    });
  }
};



const getTransactionsByFirmIdHandler = async (req, res) => {
  try {
    const { from_firm_id } = req.params;
    const { startDate, endDate } = req.query;
    console.log('Received startDate:', startDate);
    console.log('Received endDate:', endDate);

    const transactions = await getAllTransactionsByFirmId(from_firm_id, startDate, endDate);

    if (!transactions || transactions.length === 0) {
      return res.status(404).send({ status: false, message: "No transactions found for this firm" });
    }

    res.status(200).send({ status: true, data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send({ status: false, message: error.message });
  }
};



const getPaymentHandler = async (req, res) => {
  try {
    const { transaction_id } = req.params;

    const paymentDetails = await getPaymentById(transaction_id);

    if (!paymentDetails) {
      return res.status(404).send({ status: false, message: "Transaction not found" });
    }

    res.status(200).send({ status: true, data: paymentDetails });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).send({ status: false, message: error.message });
  }
};

const getTotalBalanceByFirmIdHandler = async (req, res) => {
  try {
    const { firm_id } = req.params;

    if (!firm_id) {
      return res.status(400).send({ status: false, message: "Please provide firm_id" });
    }

    const totalBalance = await getTotalBalanceByFirmId(firm_id);

    res.status(200).send({ status: true, data: { totalBalance }, message: "Total balance fetched successfully" });
  } catch (error) {
    console.error('Error fetching total balance:', error);
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createPaymentHandler, getTransactionsByFirmIdHandler, getPaymentHandler, getTotalBalanceByFirmIdHandler };
