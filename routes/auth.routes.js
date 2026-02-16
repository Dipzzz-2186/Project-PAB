const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');

router.get('/login', ctrl.loginPage);
router.post('/login', ctrl.login);
router.get('/logout', ctrl.logout);

module.exports = router;
