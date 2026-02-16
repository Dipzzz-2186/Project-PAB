const router = require('express').Router();
const { Contract } = require('../models');
const { normalizeRole, getStage, getAllowedAction } = require('../utils/workflow');

router.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const role = normalizeRole(req.session.user.role);
    const contracts = await Contract.findAll({ order: [['created_at', 'DESC']] });
    const totalContracts = contracts.length;
    const activeContracts = contracts.filter((item) => item.status !== 'completed').length;
    const totalContractValue = contracts.reduce((sum, item) => sum + (item.price || 0), 0);

    const todo = contracts
        .map((item) => {
            const stage = getStage(item.status);
            const action = getAllowedAction(item.status, role);
            if (!action) return null;
            return {
                id: item.id,
                client_name: item.client_name,
                current_stage: stage.label,
                action
            };
        })
        .filter(Boolean);

    res.render('dashboard', {
        user: req.session.user,
        role,
        totalContracts,
        activeContracts,
        totalContractValue,
        todo,
        success: req.query.success || null,
        error: req.query.error || null
    });
});

module.exports = router;
