const { normalizeRole } = require('../utils/workflow');

exports.only = (...roles) => {
    return (req, res, next) => {
        if (!req.session.user) return res.redirect('/login');

        const allowed = roles.map(normalizeRole);
        const currentRole = normalizeRole(req.session.user.role);
        if (!allowed.includes(currentRole)) {
            return res.status(403).send('Unauthorized');
        }

        next();
    };
};
