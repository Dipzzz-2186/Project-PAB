const { Contract, Billing } = require('../models');

// commercial buat contract
exports.create = async (req, res) => {
    await Contract.create({
        client_name: req.body.client_name,
        price: req.body.price,
        status: 'draft'
    });

    res.redirect('/contracts');
};

// ops feasibility
exports.feasibility = async (req, res) => {
    const contract = await Contract.findByPk(req.params.id);
    contract.status = 'feasible_checked';
    await contract.save();
    res.redirect('/contracts');
};

// finance approve
exports.approve = async (req, res) => {
    const contract = await Contract.findByPk(req.params.id);
    contract.status = 'approved';
    await contract.save();
    res.redirect('/contracts');
};

// aktivasi contract
exports.activate = async (req, res) => {
    const contract = await Contract.findByPk(req.params.id);
    contract.status = 'active';
    await contract.save();
    res.redirect('/contracts');
};

// billing bulanan
exports.generateBilling = async (req, res) => {
    await Billing.create({
        ContractId: req.params.id,
        amount: req.body.amount,
        status: 'unpaid'
    });

    res.redirect('/contracts/' + req.params.id);
};
