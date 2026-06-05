import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { api } from '../api';
const EDITOR_KEY = import.meta.env.VITE_EDITOR_KEY;

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const editorRef = useRef(null);

  const [title, setTitle] = useState('');
  const [published, setPublished] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // comment edit state
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (isNew) return;
    Promise.all([api.getPost(id), api.getComments(id)])
      .then(([postData, commentData]) => {
        const post = postData.post;
        setTitle(post.title);
        setPublished(post.published);
        setComments(commentData.comments);
        // set editor content after it mounts
        if (editorRef.current) {
          editorRef.current.setContent(post.content || '');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(publishOverride) {
    const content = editorRef.current?.getContent() || '';
    if (!title.trim()) return setError('Title is required');
    setSaving(true);
    setError(null);
    const pub = publishOverride !== undefined ? publishOverride : published;
    try {
      if (isNew) {
        const data = await api.createPost({ title, content, published: pub });
        navigate(`/posts/${data.post.id}/edit`);
      } else {
        await api.updatePost(id, { title, content, published: pub });
        setPublished(pub);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      navigate("/"); 
    }
  }

  async function handleDeleteComment(commentId) {
    if (!confirm('Delete this comment?')) return;
    try {
      await api.deleteComment(id, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSaveComment(commentId) {
    try {
      const data = await api.updateComment(id, commentId, editContent);
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: data.comment.content } : c));
      setEditingComment(null);
      setEditContent('');
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="status">Loading post...</div>;

  return (
    <div className="page editor-page">
      <div className="editor-header">
        <Link to="/" className="btn btn--ghost btn--sm">← Posts</Link>
        <div className="editor-header__actions">
          {error && <span className="editor-header__error">{error}</span>}
          {!published && (
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              Save draft
            </button>
          )}
          <button
            className="btn btn--primary btn--sm"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {published ? 'Update' : 'Publish'}
          </button>
          {published && (
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              Unpublish
            </button>
          )}
        </div>
      </div>

      <div className="editor-body">
        <input
          className="editor-title"
          type="text"
          placeholder="Post title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <div className="editor-tinymce">
          <Editor
            apiKey={EDITOR_KEY}
            onInit={(evt, editor) => {
              editorRef.current = editor;
              if (!isNew && editor) {
                api.getPost(id).then(data => {
                  editor.setContent(data.post.content || '');
                }).catch(() => {});
              }
            }}
            init={{
              height: 500,
              menubar: false,
              skin: 'oxide-dark',
              content_css: 'dark',
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'charmap',
                'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'table', 'wordcount'
              ],
              toolbar:
                'undo redo | blocks | bold italic underline | ' +
                'bullist numlist | link | code | fullscreen',
              content_style: `
                body {
                  font-family: 'DM Mono', monospace;
                  font-size: 15px;
                  color: #e8e4dc;
                  background: #0e0e0e;
                  line-height: 1.8;
                  padding: 1rem;
                }
              `,
            }}
          />
        </div>
      </div>

      {!isNew && comments.length > 0 && (
        <section className="editor-comments">
          <h2 className="editor-comments__title">
            Comments <span className="post-section__count">{comments.length}</span>
          </h2>
          <div className="comment-list">
            {comments.map(comment => (
              <div className="comment-row" key={comment.id}>
                <div className="comment-row__header">
                  <span className="comment-row__author">{comment.author.username}</span>
                  <time className="comment-row__date">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </time>
                  <div className="comment-row__actions">
                    {editingComment === comment.id ? (
                      <>
                        <button
                          className="btn btn--sm btn--primary"
                          onClick={() => handleSaveComment(comment.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn--sm btn--ghost"
                          onClick={() => setEditingComment(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn--sm btn--ghost"
                          onClick={() => {
                            setEditingComment(comment.id);
                            setEditContent(comment.content);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn--sm btn--danger"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {editingComment === comment.id ? (
                  <textarea
                    className="comment-row__edit"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="comment-row__content">{comment.content}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
