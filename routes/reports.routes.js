const router = require('express').Router();
const { Contract } = require('../models');
const { STAGES, getStage } = require('../utils/workflow');

router.get('/', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const contracts = await Contract.findAll({ order: [['created_at', 'DESC']] });
  const totals = {
    all: contracts.length,
    active: contracts.filter((item) => item.status !== 'completed').length,
    completed: contracts.filter((item) => item.status === 'completed').length,
    value: contracts.reduce((sum, item) => sum + Number(item.price || 0), 0)
  };

  const stageMap = {};
  STAGES.forEach((stage) => {
    stageMap[stage.key] = { label: stage.label, lane: stage.lane, total: 0 };
  });

  contracts.forEach((item) => {
    const stage = getStage(item.status);
    if (!stageMap[stage.key]) {
      stageMap[stage.key] = { label: stage.label, lane: stage.lane, total: 0 };
    }
    stageMap[stage.key].total += 1;
  });

  const stageRows = Object.values(stageMap).filter((item) => item.total > 0);

  res.render('reports/index', {
    user: req.session.user,
    totals,
    stageRows
  });
});

module.exports = router;
