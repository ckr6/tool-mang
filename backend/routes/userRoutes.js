const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, admin, getUsers); // Somente administradores podem listar todos os usuários
router.get('/:id', protect, admin, getUserById); // Somente administradores podem ver um usuário específico
router.put('/:id', protect, admin, updateUser); // Somente administradores podem atualizar usuários
router.delete('/:id', protect, admin, deleteUser); // Somente administradores podem deletar usuários

module.exports = router;

