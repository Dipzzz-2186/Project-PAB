const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.loginPage = (req, res) => {
    res.render('login');
};

exports.login = async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.send('User tidak ada');

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.send('Password salah');

    req.session.user = user;
    res.redirect('/dashboard');
};

exports.logout = (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
};
