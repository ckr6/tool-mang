// backend/controllers/assetController.js

const Asset = require('../models/Asset');
const Maintenance = require('../models/Maintenance');
const Category = require('../models/Category');
const { Op } = require('sequelize');

const createAsset = async (req, res) => {
  const { name, description, status, location, categoryId, categoryFields } = req.body;

  try {
    const asset = await Asset.create({ name, description, status, location, categoryId, categoryFields, lastUpdated: new Date() });
    res.status(201).json(asset);
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(400).json({ message: error.message });
  }
};

const getAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      include: {
        model: Category,
        as: 'category',
        attributes: ['name'],
      },
    });
    res.json(assets);
  } catch (error) {
    console.error('Erro ao buscar ativos:', error); // Isso ajudará a identificar o problema
    res.status(500).json({ message: 'Erro ao buscar ativos' });
  }
};


const updateAsset = async (req, res) => {
  const { id } = req.params;
  const { name, description, status, location, categoryId, categoryFields } = req.body;

  try {
    const asset = await Asset.findByPk(id);

    if (asset) {
      asset.name = name || asset.name;
      asset.description = description || asset.description;
      if (status && status !== asset.status) {
        asset.status = status;
        asset.lastUpdated = new Date(); // Atualiza a data e hora da última atualização
      }
      asset.location = location || asset.location;
      asset.categoryId = categoryId || asset.categoryId;
      asset.categoryFields = categoryFields || asset.categoryFields;

      const updatedAsset = await asset.save();
      res.json(updatedAsset);
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await Asset.findByPk(id);

    if (asset) {
      await asset.destroy();
      res.json({ message: 'Ativo deletado com sucesso' });
    } else {
      res.status(404).json({ message: 'Ativo não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao deletar ativo:', error);
    res.status(500).json({ message: 'Erro ao deletar ativo' });
  }
};

const addMaintenanceRecord = async (req, res) => {
  const { id } = req.params;
  const { description, date } = req.body;

  try {
    const asset = await Asset.findByPk(id);

    if (asset) {
      const maintenanceRecord = await Maintenance.create({
        assetId: id,
        description,
        date,
      });

      res.status(201).json(maintenanceRecord);
    } else {
      res.status(404).json({ message: 'Ativo não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao adicionar registro de manutenção:', error);
    res.status(500).json({ message: 'Erro ao adicionar registro de manutenção' });
  }
};

const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findOne({
      where: { id: req.params.id },
      include: {
        model: Category,
        as: 'category', // Usa o alias definido na associação
        attributes: ['name'], // Inclui apenas o nome da categoria
      },
    });

    if (!asset) {
      return res.status(404).json({ message: 'Ativo não encontrado' });
    }

    res.json(asset);
  } catch (error) {
    console.error('Erro ao buscar ativo:', error);
    res.status(500).json({ message: 'Erro ao buscar ativo' });
  }
};

// Outros métodos permanecem iguais...

module.exports = { createAsset, getAssets, getAssetById, updateAsset, deleteAsset, addMaintenanceRecord };
