const db = require('../db');

async function getComments(req, res) {
    try {
        // each comment relates to parent post and author
        const comments = await db.getCommentsByPost(req.params.postId);
        res.json({ comments });
        
    } catch (err) {
        res.status(500).json({ error: err.message })
    }    
}

async function createComment(req, res) {
    const { content } = req.body;
    const postId = req.params.postId;

    if (!content) return res.status(400).json({ error: 'Content is required' });
    
    try {
        const comment = await db.createComment(postId, req.user.id, content);
        
        res.status(201).json({ comment });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }    
}

async function updateComment(req, res) {
    const { content } = req.body;

    if (!content) return res.status(400).json({ error: 'Content is required' });
    
    try {
        const existing = await db.getCommentById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Comment not found' });

        if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN'){
            return res.status(403).json({ error: 'Not authorised' });
        }
        
        const comment = await db.updateComment(req.params.id, content);
        
        res.json({ comment })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }    
}

async function deleteComment(req, res) {
    try {
        const existing = await db.getCommentById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Comment not found' });

        if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN'){
            return res.status(403).json({ error: 'Not authorised' });
        }

        await db.deleteComment(req.params.id);
        
        res.json({ message: 'Comment deleted' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }    
}

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment
}