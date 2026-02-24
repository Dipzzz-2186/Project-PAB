const { Contract } = require('../models');
const { STAGES, getStage, getAllowedAction, normalizeRole } = require('../utils/workflow');

function parseRupiah(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

function toSuggestions(items, field) {
  return [...new Set(
    items
      .map((item) => String(item[field] || '').trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));
}

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
  const autocomplete = {
    client_name: toSuggestions(contracts, 'client_name'),
    brand: toSuggestions(contracts, 'brand'),
    car_type: toSuggestions(contracts, 'car_type'),
    plate_number: toSuggestions(contracts, 'plate_number'),
    branch: toSuggestions(contracts, 'branch'),
    area: toSuggestions(contracts, 'area'),
    pic: toSuggestions(contracts, 'pic')
  };
  const laneCounts = { ops: 0, commercial: 0, finance: 0, super_admin: 0 };

  data.forEach((item) => {
    laneCounts[item.stageLane] = (laneCounts[item.stageLane] || 0) + 1;
  });

  res.render('contracts/list', {
    user: req.session.user,
    data,
    stages: STAGES,
    laneCounts,
    autocomplete
  });
};

exports.create = async (req, res) => {
  if (normalizeRole(req.session?.user?.role) !== 'commercial') {
    return res.status(403).send('Unauthorized');
  }

  await Contract.create({
    client_name: req.body.client_name,
    price: parseRupiah(req.body.price),
    contract_number: req.body.contract_number || null,
    brand: req.body.brand || null,
    car_type: req.body.car_type || null,
    plate_number: req.body.plate_number || null,
    unit_count: req.body.unit_count ? Number(req.body.unit_count) : null,
    year: req.body.year || null,
    base_price: req.body.base_price ? parseRupiah(req.body.base_price) : null,
    ppn: req.body.ppn ? parseRupiah(req.body.ppn) : null,
    total_price: req.body.total_price ? parseRupiah(req.body.total_price) : null,
    branch: req.body.branch || null,
    area: req.body.area || null,
    pic: req.body.pic || null,
    notes: req.body.notes || null,
    start_date: req.body.start_date || null,
    end_date: req.body.end_date || null,
    status: 'reported_by_sales'
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

    if (action.actionKey === 'submit_feasibility' || action.actionKey === 'submit_feasibility_legacy') {
      const note = String(req.body.feasibility_note || '').trim();
      if (!note) {
        return res.status(400).send('Catatan feasibility wajib diisi');
      }

      const oldNotes = String(contract.notes || '').trim();
      const prefix = `[Feasibility Ops ${new Date().toISOString().slice(0, 10)}] ${note}`;
      contract.notes = oldNotes ? `${oldNotes}\n${prefix}` : prefix;
    }

    contract.status = action.to;
    await contract.save();

    res.redirect('/contracts');
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).send(err?.message || 'Terjadi kesalahan saat memperbarui kontrak');
  }
};
