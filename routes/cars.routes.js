const router = require('express').Router();
const role = require('../middlewares/role.middleware');

router.get('/', role.only('super_admin'), (req, res) => {
  res.render('cars/list', { user: req.session.user });
});

module.exports = router;
