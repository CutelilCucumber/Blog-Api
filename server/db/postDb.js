const prisma = require('./prismaClient');

async function getAllPosts(includeUnpublished = false) {
  return prisma.post.findMany({
    where: includeUnpublished ? {} : { published: true },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, username: true } },
      _count: { select: { comments: true } }
    }
  });
}

async function getPostById(id, includeUnpublished = false) {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: { select: { id: true, username: true } },
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, username: true } }
        }
      }
    }
  });

  if (!post) return null;
  if (!includeUnpublished && !post.published) return null;
  return post;
}

async function createPost(authorId, { title, content, published }) {
  return prisma.post.create({
    data: { title, content, published: published || false, authorId }
  });
}

async function updatePost(id, { title, content, published }) {
  return prisma.post.update({
    where: { id: parseInt(id) },
    data: { title, content, published }
  });
}

async function deletePost(id) {
  return prisma.post.delete({ where: { id: parseInt(id) } });
}

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };