const router = require('express').Router();

router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('cars/list', { user: req.session.user });
});

module.exports = router;
