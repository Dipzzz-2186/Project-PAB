const router = require('express').Router();
const { Contract } = require('../models');

router.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const contracts = await Contract.findAll({
        order: [['createdAt', 'DESC']]
    });

    const totalContracts = contracts.length;
    const activeContracts = contracts.filter((item) => item.status === 'active').length;
    const totalContractValue = contracts.reduce((sum, item) => sum + (item.price || 0), 0);
    const recentContracts = contracts.slice(0, 5);

    res.render('dashboard', {
        user: req.session.user,
        contracts,
        totalContracts,
        activeContracts,
        totalContractValue,
        recentContracts
    });
});

module.exports = router;
