const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306, // Adiciona a porta aqui
  dialect: 'mysql',
  logging: console.log,
});

module.exports = sequelize;
