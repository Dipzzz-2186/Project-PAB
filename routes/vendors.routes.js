const router = require('express').Router();
const { Contract } = require('../models');
const role = require('../middlewares/role.middleware');

router.get('/', role.only('super_admin'), async (req, res) => {
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
