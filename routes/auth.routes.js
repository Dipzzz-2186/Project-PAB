const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const role = require('../middlewares/role.middleware');

router.get('/login', ctrl.loginPage);
router.post('/login', ctrl.login);
router.get('/logout', ctrl.logout);
router.post('/users/create', role.only('super_admin'), ctrl.createUser);

module.exports = router;
