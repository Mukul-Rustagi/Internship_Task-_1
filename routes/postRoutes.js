const express = require('express');
const {
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePost,
  likePost,
  addComment,
} = require('../controller/postcontroller');
const { protect } = require('../middleware/auth');

const router = express.Router();


router.post('/protect', createPost)
router.get('/protect', getPosts);


  router.get('/protect/:id', getPost)
  router.delete('/protect/:id', deletePost)
  router.put('/protect/:id', updatePost);

router.put('/like/:id',likePost);
router.post('/comment/:id',addComment);

module.exports = router;
