const { Contract } = require('../models');
const { STAGES, getStage, getAllowedAction, normalizeRole } = require('../utils/workflow');

function buildContractView(contract, role) {
  const stage = getStage(contract.status);
  const allowedAction = getAllowedAction(contract.status, role);
  return {
    ...contract.toJSON(),
    stageLabel: stage.label,
    stageLane: stage.lane,
    allowedAction
  };
}

exports.list = async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const role = normalizeRole(req.session.user.role);
  const contracts = await Contract.findAll({ order: [['created_at', 'DESC']] });
  const data = contracts.map((contract) => buildContractView(contract, role));
  const laneCounts = { ops: 0, commercial: 0, finance: 0, super_admin: 0 };

  data.forEach((item) => {
    laneCounts[item.stageLane] = (laneCounts[item.stageLane] || 0) + 1;
  });

  res.render('contracts/list', {
    user: req.session.user,
    data,
    stages: STAGES,
    laneCounts
  });
};

exports.create = async (req, res) => {
  await Contract.create({
    client_name: req.body.client_name,
    price: Number(req.body.price || 0),
    start_date: req.body.start_date || null,
    end_date: req.body.end_date || null,
    status: 'draft'
  });

  res.redirect('/contracts');
};

exports.progress = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) return res.status(404).send('Kontrak tidak ditemukan');

    const action = getAllowedAction(contract.status, req.session.user.role);
    if (!action || action.actionKey !== req.params.actionKey) {
      return res.status(400).send('Aksi tidak valid untuk role atau tahap saat ini');
    }

    contract.status = action.to;
    await contract.save();

    res.redirect('/contracts');
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).send(err?.message || 'Terjadi kesalahan saat memperbarui kontrak');
  }
};
