const Story = require('../models/Story');

exports.createStory = async (req, res) => {
  try {
    const { title, content } = req.body;

    const story = await Story.create({
      title,
      content: content || '',
      owner: req.user._id,
      lastEditedBy: req.user._id
    });

    res.status(201).json(story);
  } catch (err) {
    console.error('Create story error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find({ owner: req.user._id }).sort('-updatedAt');
    res.json(stories);
  } catch (err) {
    console.error('Get stories error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json(story);
  } catch (err) {
    console.error('Get story error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStory = async (req, res) => {
  try {
    const { title, content } = req.body;

    const story = await Story.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { title, content, lastEditedBy: req.user._id },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({ message: 'Story not found or not yours' });
    }

    res.json(story);
  } catch (err) {
    console.error('Update story error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found or not yours' });
    }

    res.json({ message: 'Story deleted' });
  } catch (err) {
    console.error('Delete story error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
