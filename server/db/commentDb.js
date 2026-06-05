const prisma = require('./prismaClient');

async function getCommentsByPost(postId) {
  return prisma.comment.findMany({
    where: { postId: parseInt(postId) },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, username: true } }
    }
  });
}

async function getCommentById(id) {
  return prisma.comment.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: { select: { id: true, username: true } }
    }
  });
}

async function createComment(postId, authorId, content) {
  return prisma.comment.create({
    data: { postId: parseInt(postId), authorId, content },
    include: {
      author: { select: { id: true, username: true } }
    }
  });
}

async function updateComment(id, content) {
  return prisma.comment.update({
    where: { id: parseInt(id) },
    data: { content }
  });
}

async function deleteComment(id) {
  return prisma.comment.delete({ where: { id: parseInt(id) } });
}

async function deleteCommentsByPost(postId) {
  return prisma.comment.deleteMany({ where: { postId: parseInt(postId) } });
}

module.exports = {
  getCommentsByPost,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  deleteCommentsByPost
};