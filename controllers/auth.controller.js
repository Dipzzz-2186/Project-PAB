const bcrypt = require('bcrypt');
const { User } = require('../models');
const { normalizeRole } = require('../utils/workflow');

exports.loginPage = (req, res) => {
    res.render('login');
};

exports.login = async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.send('User tidak ada');

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.send('Password salah');

    req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: normalizeRole(user.role)
    };
    res.redirect('/dashboard');
};

exports.logout = (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
};

exports.createUser = async (req, res) => {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const role = normalizeRole(req.body.role);

    if (!name || !email || !password || !role) {
        return res.redirect('/dashboard?error=Lengkapi semua field akun');
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
        return res.redirect('/dashboard?error=Email sudah digunakan');
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash, role });

    return res.redirect('/dashboard?success=Akun baru berhasil dibuat');
};
