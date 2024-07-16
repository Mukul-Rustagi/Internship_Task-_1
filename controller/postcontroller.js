const Post = require('../model/Post');
const User = require('../model/user');

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    
    // Ensure userId is present in the request body
    if (!req.body.userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const user = await User.findById(req.body.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const newPost = new Post({
      text: req.body.text,
      image: req.body.image,
      tags: req.body.tags,
      location: req.body.location,
      user: req.body.userId,
    });

    const post = await newPost.save();

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ date: -1 })
      .populate({
        path: 'user',
        select: 'name email',  // Populate user details with name and email
      })
      .populate({
        path: 'likes.user',
        select: 'name email',
      })
      .populate({
        path: 'comments.user',
        select: 'name email',
      });

    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Ensure user owns the post
    if (post.user.toString() !== req.body.userId) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Ensure user owns the post
    if (post.user.toString() !== req.body.userId) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }

    await post.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Like a post
// @route   PUT /api/posts/like/:id
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    if (post.likes.filter(like => like.user.toString() === req.body.userId).length > 0) {
      return res.status(400).json({ success: false, error: 'Post already liked' });
    }

    post.likes.unshift({ user: req.body.userId });

    await post.save();

    res.status(200).json({ success: true, data: post.likes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/comment/:id
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const newComment = {
      text: req.body.text,
      user: req.body.userId,
    };

    post.comments.unshift(newComment);

    await post.save();

    res.status(201).json({ success: true, data: post.comments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
