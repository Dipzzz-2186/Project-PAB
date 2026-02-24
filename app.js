const express = require('express');
const session = require('express-session');
const path = require('path');
const { sequelize } = require('./models');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'sessions'
});

// view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret123',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 hari
    }
}));

sessionStore.sync();

// routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.use('/', require('./routes/auth.routes'));
app.use('/dashboard', require('./routes/dashboard.routes'));
app.use('/contracts', require('./routes/contract.routes'));
app.use('/clients', require('./routes/clients.routes'));
app.use('/cars', require('./routes/cars.routes'));
app.use('/vendors', require('./routes/vendors.routes'));
app.use('/reports', require('./routes/reports.routes'));
app.use('/billing', require('./routes/billing.routes'));
app.use('/settings', require('./routes/settings.routes'));

app.listen(3000, () => {
    console.log('Server jalan di http://localhost:3000');
});
