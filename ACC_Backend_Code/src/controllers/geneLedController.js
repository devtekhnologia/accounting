const { createGeneralLedger, getGeneralLedgersByFirm, updateGeneralLedger, deleteGeneralLedger, generalLedgerExists } = require('../models/generalLedgerModel');

const createGeneralLedgerHandler = async (req, res) => {
  try {
    const { gl_name, gl_type, open_balance } = req.body; // Include gl_type
    const { firm_id } = req.params;

    if (!gl_name || !firm_id || !gl_type) { // Check if gl_type is provided
      return res.status(400).send({ status: false, message: 'General Ledger name, Firm ID, and GL Type are required' });
    }

    const existingGeneralLedger = await generalLedgerExists(firm_id, gl_name);
    if (existingGeneralLedger) {
      return res.status(400).send({ status: false, message: 'Firm Account with this name already exists' });
    }

    const gl_id = await createGeneralLedger(firm_id, gl_name, gl_type, open_balance); // Pass gl_type
    res.status(201).send({ status: true, data: gl_id, message: 'Firm Account created successfully' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};


const getGeneralLedgersHandler = async (req, res) => {
  try {
    const { firm_id } = req.params;
    const generalLedgers = await getGeneralLedgersByFirm(firm_id);
    res.status(200).send({ status: true, data: generalLedgers });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const updateGeneralLedgerHandler = async (req, res) => {
  try {
    const { gl_name, gl_status } = req.body;
    const { firm_id, gl_id } = req.params;

    if (!gl_name || !gl_status) {
      return res.status(400).send({ status: false, message: 'General Ledger name and status are required' });
    }

    const updated = await updateGeneralLedger(firm_id, gl_id, gl_name, gl_status);
    if (updated) {
      res.status(200).send({ status: true, message: 'Firm Account updated successfully' });
    } else {
      res.status(404).send({ status: false, message: 'General Ledger not found' });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const deleteGeneralLedgerHandler = async (req, res) => {
  try {
    const { firm_id, gl_id } = req.params;

    const deleted = await deleteGeneralLedger(firm_id, gl_id);
    if (deleted) {
      res.status(200).send({ status: true, message: 'Firm Account deleted successfully' });
    } else {
      res.status(404).send({ status: false, message: 'General Ledger not found' });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createGeneralLedgerHandler, getGeneralLedgersHandler, updateGeneralLedgerHandler, deleteGeneralLedgerHandler };
