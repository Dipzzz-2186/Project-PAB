const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false
}));

// routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.use('/', require('./routes/auth.routes'));
app.use('/dashboard', require('./routes/dashboard.routes'));
app.use('/contracts', require('./routes/contract.routes'));

const { sequelize } = require('./models');

app.listen(3000, () => {
    console.log('Server jalan di http://localhost:3000');
});
