const Loan = require('../models/Loan');
const Asset = require('../models/Asset');
const User = require('../models/User');
const { Op } = require('sequelize');

const createLoan = async (req, res) => {
  const { userId, assetId, loanDate, returnDate } = req.body;
  try {
    const loan = await Loan.create({ userId, assetId, loanDate, returnDate });
    const asset = await Asset.findByPk(assetId);
    if (asset) {
      asset.status = 'Emprestado';
      await asset.save();
    }
    res.status(201).json(loan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLoans = async (req, res) => {
  const { search, status } = req.query;
  let where = {};

  // Filtro de busca por nome de usuário ou ativo
  if (search) {
    where = {
      ...where,
      [Op.or]: [
        { '$user.username$': { [Op.like]: `%${search}%` } },
        { '$asset.name$': { [Op.like]: `%${search}%` } },
      ]
    };
  }

  // Filtro de status para listar apenas empréstimos ativos
  if (status === 'ativos') {
    where = {
      ...where,
      returnDate: null
    };
  }

  try {
    const loans = await Loan.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: Asset, as: 'asset', attributes: ['id', 'name'] },
      ]
    });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLoanById = async (req, res) => {
  const { id } = req.params;
  try {
    const loan = await Loan.findByPk(id, { include: [User, Asset] });
    if (loan) {
      res.json(loan);
    } else {
      res.status(404).json({ message: 'Empréstimo não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLoan = async (req, res) => {
  const { id } = req.params;
  const { returnDate } = req.body;
  try {
    const loan = await Loan.findByPk(id);
    if (loan) {
      loan.returnDate = returnDate;
      await loan.save();
      res.json(loan);
    } else {
      res.status(404).json({ message: 'Empréstimo não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLoan = async (req, res) => {
  const { id } = req.params;
  try {
    const loan = await Loan.findByPk(id);
    if (loan) {
      const asset = await Asset.findByPk(loan.assetId);
      await loan.destroy();

      // Verifica se não há mais empréstimos para este ativo e, se não houver, define como "Disponível"
      const activeLoans = await Loan.findAll({ where: { assetId: loan.assetId, returnDate: null } });
      if (activeLoans.length === 0 && asset) {
        asset.status = 'Disponível';
        await asset.save();
      }

      res.json({ message: 'Empréstimo deletado com sucesso' });
    } else {
      res.status(404).json({ message: 'Empréstimo não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const returnLoan = async (req, res) => {
  const { id } = req.params;
  try {
    const loan = await Loan.findByPk(id);
    if (loan) {
      loan.returnDate = new Date();
      await loan.save();
      const asset = await Asset.findByPk(loan.assetId);
      if (asset) {
        asset.status = 'Disponível';
        await asset.save();
      }
      res.json(loan);
    } else {
      res.status(404).json({ message: 'Empréstimo não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLoanHistoryByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const loans = await Loan.findAll({
      where: { userId },
      include: [Asset]
    });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLoanHistoryByAssetId = async (req, res) => {
  const { assetId } = req.params;
  try {
    const loans = await Loan.findAll({
      where: { assetId },
      include: [User]
    });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createLoan, getLoans, getLoanById, updateLoan, deleteLoan, returnLoan, getLoanHistoryByUserId, getLoanHistoryByAssetId };
