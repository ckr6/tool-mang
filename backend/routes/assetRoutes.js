const express = require('express');
const {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  addMaintenanceRecord,
} = require('../controllers/assetController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, admin, createAsset);
router.post('/:id/maintenance', protect, admin, addMaintenanceRecord);
router.get('/', protect, getAssets);
router.get('/:id', protect, getAssetById);
router.put('/:id', protect, admin, updateAsset);
router.delete('/:id', protect, admin, deleteAsset);

module.exports = router;


