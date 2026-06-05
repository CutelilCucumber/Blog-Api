const { Router } = require('express');
const { verifyToken, optionalAuth, isMember } = require('../middleware/auth');
const postRouter = Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

// /posts

postRouter.get('/', optionalAuth, getPosts);
postRouter.get('/:id', optionalAuth, getPost);

// { required body:
//     "title": "",
//     "content": "",
//     "published": BOOLEAN
// } createPost uses author from req.user
postRouter.post('/', verifyToken, isMember, createPost);

// { required body:
//     "title": "",
//     "content": "",
//     "published": BOOLEAN
// } compares and replaces existing with body, using id params
postRouter.put('/:id', verifyToken, isMember, updatePost);
postRouter.delete('/:id', verifyToken, isMember, deletePost);

module.exports = postRouter;