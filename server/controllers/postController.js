const db = require('../db');
const sanitizeHtml = require('sanitize-html');

async function getPosts(req, res) {
  try {
    // an admin should be able to see unpublished posts
    const includeUnpublished =
      req.query.all === 'true' && req.user?.role === 'ADMIN';
    const posts = await db.getAllPosts(includeUnpublished);

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPost(req, res) {
  try {
    const includeUnpublished = req.user?.role === 'ADMIN';
    const post = await db.getPostById(req.params.id, includeUnpublished);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    res.json({ post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createPost(req, res) {
  const { title, content, published } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required' });

  const sanitizedContent = content
  ? sanitizeHtml(content, {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre'],
      allowedAttributes: {
        a: ['href', 'target'],
      },
    })
  : content;

  try {
    const post = await db.createPost(req.user.id, { title, content: sanitizedContent, published });
    
    res.status(201).json({ post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updatePost(req, res) {
  const { title, content, published } = req.body;

  try {
    const existing = await db.getPostById(req.params.id, true);
    if (!existing) return res.status(404).json({ error: 'Post not found' });

    if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorised' });
    }

    const post = await db.updatePost(req.params.id, { title, content, published });
    
    res.json({ post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deletePost(req, res) {
  try {
    const existing = await db.getPostById(req.params.id, true);
    if (!existing) return res.status(404).json({ error: 'Post not found' });

    if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorised' });
    }

    await db.deleteCommentsByPost(req.params.id);
    await db.deletePost(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost 
};