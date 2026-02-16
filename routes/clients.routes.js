const router = require('express').Router();
const { Contract } = require('../models');

router.get('/', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const contracts = await Contract.findAll();
  const clients = {};

  contracts.forEach((c) => {
    const name = c.client_name || 'Tanpa Nama';
    if (!clients[name]) {
      clients[name] = { name, totalContracts: 0, totalValue: 0, latestStatus: c.status };
    }
    clients[name].totalContracts += 1;
    clients[name].totalValue += Number(c.price || 0);
    clients[name].latestStatus = c.status;
  });

  const rows = Object.values(clients).sort((a, b) => a.name.localeCompare(b.name));

  res.render('clients/list', {
    user: req.session.user,
    data: rows
  });
});

module.exports = router;
