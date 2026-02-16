exports.only = (...roles) => {
    return (req, res, next) => {
        if (!req.session.user) return res.redirect('/login');

        if (!roles.includes(req.session.user.role)) {
            return res.send('Unauthorized');
        }

        next();
    };
};
