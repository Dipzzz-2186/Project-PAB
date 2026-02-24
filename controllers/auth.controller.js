const bcrypt = require('bcrypt');
const { User } = require('../models');
const { normalizeRole } = require('../utils/workflow');

exports.loginPage = (req, res) => {
    res.render('login', {
        error: String(req.query.error || '')
    });
};

exports.login = async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
        return res.redirect('/login?error=Email%20dan%20password%20wajib%20diisi');
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.redirect('/login?error=User%20tidak%20ada');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.redirect('/login?error=Password%20salah');

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
