const router = require('express').Router();
const ctrl = require('../controllers/contract.controller');
const role = require('../middlewares/role.middleware');

router.get('/', ctrl.list);

router.post('/create', role.only('commercial', 'super_admin'), ctrl.create);
router.post('/:id/action/:actionKey', role.only('commercial', 'ops', 'finance'), ctrl.progress);

module.exports = router;
