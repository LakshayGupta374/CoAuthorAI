const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createStory,
  getStories,
  getStoryById,
  updateStory,
  deleteStory
} = require('../controllers/storyController');

router.use(protect); // all routes below require auth

router.post('/', createStory);
router.get('/', getStories);
router.get('/:id', getStoryById);
router.put('/:id', updateStory);
router.delete('/:id', deleteStory);

module.exports = router;
