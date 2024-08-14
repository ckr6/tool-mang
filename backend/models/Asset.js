const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config');
const Category = require('./Category'); // Importa o modelo Category

const Asset = sequelize.define('Asset', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categoryFields: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  hooks: {
    beforeUpdate: (asset, options) => {
      if (asset.changed('status')) {
        asset.lastUpdated = new Date();
      }
    }
  }
});

// Definindo a associação entre Asset e Category
Asset.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = Asset;
