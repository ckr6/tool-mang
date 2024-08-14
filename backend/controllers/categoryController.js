const Category = require('../models/Category');

const createCategory = async (req, res) => {
  const { name, fields } = req.body;

  if (!name || !fields) {
    return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
  }

  try {
    const category = await Category.create({ name, fields });
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Categoria não encontrada' });
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCategory, getCategories, getCategoryById };
