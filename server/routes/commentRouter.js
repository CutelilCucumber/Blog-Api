const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
// mergeParams: true required since postID is required in parent params
const commentRouter = Router({ mergeParams: true });
const {
  getComments,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

// /posts/postId/comments

commentRouter.get('/', getComments);

// { required body:
//     "content": ""
// } postId is passed in params
commentRouter.post('/', verifyToken, createComment);

// { required body:
//     "content": ""
// } postId and commentId is passed in params
commentRouter.put('/:id', verifyToken, updateComment);
commentRouter.delete('/:id', verifyToken, deleteComment);

module.exports = commentRouter;