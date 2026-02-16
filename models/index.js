require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

// USER
const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true
});

// CONTRACT
const Contract = sequelize.define('Contract', {
    client_name: DataTypes.STRING,
    status: DataTypes.STRING,
    price: DataTypes.INTEGER,
    contract_number: DataTypes.STRING,
    brand: DataTypes.STRING,
    car_type: DataTypes.STRING,
    plate_number: DataTypes.STRING,
    unit_count: DataTypes.INTEGER,
    year: DataTypes.STRING,
    base_price: DataTypes.INTEGER,
    ppn: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER,
    branch: DataTypes.STRING,
    area: DataTypes.STRING,
    pic: DataTypes.STRING,
    notes: DataTypes.TEXT,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
}, {
    tableName: 'contracts',
    timestamps: true,
    underscored: true
});

// BILLING
const Billing = sequelize.define('Billing', {
    amount: DataTypes.INTEGER,
    status: DataTypes.STRING
}, {
    tableName: 'billings',
    timestamps: true,
    underscored: true
});

Contract.hasMany(Billing);
Billing.belongsTo(Contract);

module.exports = {
    sequelize,
    User,
    Contract,
    Billing
};
