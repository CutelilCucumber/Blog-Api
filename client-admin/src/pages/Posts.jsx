import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getPosts()
      .then(data => setPosts(data.posts))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleTogglePublish(post) {
    try {
      const updated = await api.togglePublished(post.id, !post.published);
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: updated.post.published } : p));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this post and all its comments?')) return;
    try {
      await api.deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="status">Loading...</div>;
  if (error) return <div className="status status--error">{error}</div>;

  const published = posts.filter(p => p.published);
  const drafts = posts.filter(p => !p.published);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Posts</h1>
        <Link to="/posts/new" className="btn btn--primary">New post</Link>
      </div>

      {drafts.length > 0 && (
        <section className="post-section">
          <h2 className="post-section__heading">Drafts <span className="post-section__count">{drafts.length}</span></h2>
          <div className="post-table">
            {drafts.map(post => (
              <PostRow
                key={post.id}
                post={post}
                onToggle={handleTogglePublish}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}

      <section className="post-section">
        <h2 className="post-section__heading">Published <span className="post-section__count">{published.length}</span></h2>
        {published.length === 0 ? (
          <p className="status">No published posts yet.</p>
        ) : (
          <div className="post-table">
            {published.map(post => (
              <PostRow
                key={post.id}
                post={post}
                onToggle={handleTogglePublish}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PostRow({ post, onToggle, onDelete }) {
  return (
    <div className="post-row">
      <div className="post-row__main">
        <span className={`post-row__status ${post.published ? 'post-row__status--published' : 'post-row__status--draft'}`}>
          {post.published ? 'Published' : 'Draft'}
        </span>
        <Link to={`/posts/${post.id}/edit`} className="post-row__title">
          {post.title}
        </Link>
        <span className="post-row__meta">
          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {' · '}
          {post._count?.comments ?? 0} comments
        </span>
      </div>
      <div className="post-row__actions">
        <button
          className={`btn btn--sm ${post.published ? 'btn--ghost' : 'btn--publish'}`}
          onClick={() => onToggle(post)}
        >
          {post.published ? 'Unpublish' : 'Publish'}
        </button>
        <Link to={`/posts/${post.id}/edit`} className="btn btn--sm btn--ghost">Edit</Link>
        <button className="btn btn--sm btn--danger" onClick={() => onDelete(post.id)}>Delete</button>
      </div>
    </div>
  );
}
