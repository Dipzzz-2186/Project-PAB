const router = require('express').Router();
const { Contract } = require('../models');

router.get('/', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const contracts = await Contract.findAll({ order: [['created_at', 'DESC']] });
  const map = {};

  contracts.forEach((item) => {
    const vendor = item.branch || 'Vendor Belum Ditentukan';
    if (!map[vendor]) {
      map[vendor] = {
        name: vendor,
        totalContracts: 0,
        totalUnits: 0,
        latestClient: item.client_name || '-'
      };
    }
    map[vendor].totalContracts += 1;
    map[vendor].totalUnits += Number(item.unit_count || 0);
    map[vendor].latestClient = item.client_name || map[vendor].latestClient;
  });

  const rows = Object.values(map).sort((a, b) => a.name.localeCompare(b.name));

  res.render('vendors/list', {
    user: req.session.user,
    data: rows
  });
});

module.exports = router;
