const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');  // Importando o modelo Loan
const Asset = require('../models/Asset');  // Importando o modelo Asset
const User = require('../models/User');  // Importando o modelo User

// Rota para obter todos os empréstimos (com filtros opcionais)
router.get('/', async (req, res) => {
  const { search, status, category, date } = req.query;

  try {
    let whereClause = {};

    if (search) {
      whereClause = {
        ...whereClause,
        // Filtro para buscar por usuário ou ativo
        [Op.or]: [
          { '$user.name$': { [Op.like]: `%${search}%` } },
          { '$asset.name$': { [Op.like]: `%${search}%` } }
        ]
      };
    }

    if (status) {
      // Filtro para o status do empréstimo
      whereClause = {
        ...whereClause,
        status
      };
    }

    if (category) {
      // Filtro para a categoria do ativo
      whereClause = {
        ...whereClause,
        '$asset.category$': category
      };
    }

    if (date) {
      // Filtro para a data do empréstimo
      whereClause = {
        ...whereClause,
        loanDate: date
      };
    }

    const loans = await Loan.findAll({
      where: whereClause,
      include: [User, Asset]
    });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar empréstimos', error });
  }
});

// Rota para criar um novo empréstimo
router.post('/', async (req, res) => {
  const { userId, assetId, loanDate, returnDate } = req.body;

  try {
    // 1. Atualizar o status do ativo para "Emprestado"
    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Ativo não encontrado' });
    }

    asset.status = 'Emprestado';
    await asset.save();

    // 2. Criar a entrada de empréstimo
    const loan = await Loan.create({
      userId,
      assetId,
      loanDate,
      returnDate,
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar o empréstimo', error });
  }
});

module.exports = router;
