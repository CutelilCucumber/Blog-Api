import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getPosts()
      .then(data => setPosts(data.posts))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="status">Loading posts...</div>;
  if (error) return <div className="status status--error">{error}</div>;

  return (
    <main className="home">
      <div className="home__header">
        <h1 className="home__title">Latest</h1>
        <p className="home__sub">Thoughts, notes, various writings.</p>
      </div>

      {posts.length === 0 && (
        <p className="status">No posts yet.</p>
      )}

      <div className="post-grid">
        {posts.map((post, i) => (
          <Link
            to={`/posts/${post.id}`}
            className="post-card"
            key={post.id}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="post-card__meta">
              <span className="post-card__author">{post.author.username}</span>
              <span className="post-card__date">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </span>
            </div>
            <h2 className="post-card__title">{post.title}</h2>
            {post.content && (
              <p className="post-card__excerpt">
                {getExcerpt(post.content)}
              </p>
            )}
            <div className="post-card__footer">
              <span className="post-card__comments">
                {post._count.comments} comment{post._count.comments !== 1 ? 's' : ''}
              </span>
              <span className="post-card__read">Read →</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

function getExcerpt(html, maxLength = 140) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const text = doc.body.textContent || '';

  return text.length > maxLength
    ? text.slice(0, maxLength) + '…'
    : text;
}