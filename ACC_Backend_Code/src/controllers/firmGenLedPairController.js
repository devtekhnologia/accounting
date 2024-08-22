const { getFirmsByUserId } = require('../models/firmModel');
const { getGeneralLedgersByFirm } = require('../models/generalLedgerModel');

const getFirmAndGeneralLedgerPairsHandler = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Step 1: Fetch all firms associated with the user
    const firms = await getFirmsByUserId(user_id);

    if (!firms.length) {
      return res.status(404).send({ status: false, message: 'No firms found for this user' });
    }

    // Step 2: Fetch all general ledgers for each firm
    let firmGlPairs = [];
    for (const firm of firms) {
      const generalLedgers = await getGeneralLedgersByFirm(firm.firm_id);
      
      for (const ledger of generalLedgers) {
        firmGlPairs.push({
          firm_id: firm.firm_id,
          firm_name: firm.firm_name,
          gl_id: ledger.gl_id,
          gl_name: ledger.gl_name,
        });
      }
    }

    // Step 3: Group by firm_id and gl_id
    firmGlPairs = firmGlPairs.reduce((acc, pair) => {
      if (!acc.some(item => item.firm_id === pair.firm_id && item.gl_id === pair.gl_id)) {
        acc.push(pair);
      }
      return acc;
    }, []);

    res.status(200).send({ status: true, data: firmGlPairs });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const getFirmAndGeneralLedgerPairsByAddingUserHandler = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Step 1: Fetch all firms associated with the user
    const firms = await getFirmsByUserId(user_id);

    if (!firms.length) {
      return res.status(404).send({ status: false, message: 'No firms found for this user' });
    }

    let allFirms = [...firms];

    // Step 2: Fetch firms added by added_by_user_id for each firm
    for (const firm of firms) {
      const additionalFirms = await getFirmsByUserId(firm.added_by_user_id);
      if (additionalFirms && additionalFirms.length > 0) {
        allFirms.push(...additionalFirms);
      }
    }

    // Step 3: Remove duplicate firms
    const uniqueFirms = Array.from(new Set(allFirms.map(firm => firm.firm_id)))
      .map(id => allFirms.find(firm => firm.firm_id === id));

    // Step 4: Fetch all general ledgers for each unique firm and form firm-GL pairs
    let firmGlPairs = [];
    for (const firm of uniqueFirms) {
      const generalLedgers = await getGeneralLedgersByFirm(firm.firm_id);
      
      for (const ledger of generalLedgers) {
        firmGlPairs.push({
          firm_id: firm.firm_id,
          firm_name: firm.firm_name,
          gl_id: ledger.gl_id,
          gl_name: ledger.gl_name,
        });
      }
    }

    // Step 5: Group by firm_id and gl_id
    firmGlPairs = firmGlPairs.reduce((acc, pair) => {
      if (!acc.some(item => item.firm_id === pair.firm_id && item.gl_id === pair.gl_id)) {
        acc.push(pair);
      }
      return acc;
    }, []);

    res.status(200).send({ status: true, data: firmGlPairs });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};



module.exports = { getFirmAndGeneralLedgerPairsHandler, getFirmAndGeneralLedgerPairsByAddingUserHandler };
