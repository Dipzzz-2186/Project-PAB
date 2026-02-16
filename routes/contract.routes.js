const router = require('express').Router();
const ctrl = require('../controllers/contract.controller');
const role = require('../middlewares/role.middleware');

router.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const { Contract } = require('../models');
    const data = await Contract.findAll();
    res.render('contracts/list', { data, user: req.session.user });
});

router.post('/create', role.only('commercial'), ctrl.create);
router.post('/:id/update', role.only('commercial'), ctrl.update);
router.post('/:id/feasibility', role.only('ops'), ctrl.feasibility);
router.post('/:id/approve', role.only('finance'), ctrl.approve);
router.post('/:id/activate', role.only('ops'), ctrl.activate);
router.post('/:id/billing', role.only('finance'), ctrl.generateBilling);

module.exports = router;
