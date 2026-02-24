const router = require('express').Router();
const { Contract } = require('../models');
const { getStage } = require('../utils/workflow');

router.get('/', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const contracts = await Contract.findAll({ order: [['created_at', 'DESC']] });
  const rows = contracts
    .map((item) => {
      const stage = getStage(item.status);
      return {
        contract_number: item.contract_number || '-',
        client_name: item.client_name || '-',
        price: Number(item.price || 0),
        status: stage.label,
        billingReady: ['finance', 'commercial'].includes(stage.lane) || item.status === 'contract_activated'
      };
    })
    .filter((item) => item.billingReady);

  const totals = {
    count: rows.length,
    value: rows.reduce((sum, item) => sum + item.price, 0)
  };

  res.render('billing/index', {
    user: req.session.user,
    data: rows,
    totals
  });
});

module.exports = router;
