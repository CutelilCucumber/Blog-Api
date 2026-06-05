import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Post() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    Promise.all([api.getPost(id), api.getComments(id)])
      .then(([postData, commentData]) => {
        setPost(postData.post);
        setComments(commentData.comments);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    setCommentError(null);
    try {
      const data = await api.createComment(id, commentText.trim());
      setComments(prev => [data.comment, ...prev]);
      setCommentText('');
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await api.deleteComment(id, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="status">Loading...</div>;
  if (error) return <div className="status status--error">{error}</div>;
  if (!post) return <div className="status">Post not found.</div>;

  return (
    <main className="post-page">
      <Link to="/" className="post-page__back">← All posts</Link>

      <article className="post-page__article">
        <header className="post-page__header">
          <div className="post-page__meta">
            <span>{post.author.username}</span>
            <span className="post-page__dot">·</span>
            <time>{new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            })}</time>
          </div>
          <h1 className="post-page__title">{post.title}</h1>
        </header>

        <div
          className="post-page__content"
          dangerouslySetInnerHTML={{
            __html: post.content
          }}
        />
      </article>

      <section className="comments">
        <h2 className="comments__title">
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </h2>

        {user ? (
          <form className="comment-form" onSubmit={handleComment}>
            <textarea
              className="comment-form__input"
              placeholder="Leave a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              rows={3}
              required
            />
            {commentError && <p className="comment-form__error">{commentError}</p>}
            <button className="comment-form__btn" type="submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post comment'}
            </button>
          </form>
        ) : (
          <p className="comments__login">
            <Link to="/login">Sign in</Link> to leave a comment.
          </p>
        )}

        <div className="comment-list">
          {comments.map(comment => (
            <div className="comment" key={comment.id}>
              <div className="comment__header">
                <span className="comment__author">{comment.author.username}</span>
                <time className="comment__date">
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </time>
                {user && (user.id === comment.author.id || user.role === 'ADMIN') && (
                  <button
                    className="comment__delete"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="comment__content">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
