import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  async function createNewPost(e) {
    e.preventDefault();

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('author', author);
    data.set('date', date);
    if (files && files[0]) {
      data.set('file', files[0]);
    }

    try {
      const response = await fetch('http://localhost:4000/post', { // Adjusted to lowercase 'post'
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setRedirect(true);
        console.log('Post created successfully');
      } else {
        const contentType = response.headers.get('Content-Type');
        let errorText;

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorText = errorData.error || 'Failed to create post';
        } else {
          errorText = await response.text();
        }

        setError(errorText);
        console.error('Failed to create post:', errorText);
      }
    } catch (error) {
      console.error('Error during post creation:', error);
      setError('An error occurred during post creation.');
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input 
        type="file" 
        onChange={e => setFiles(e.target.files)}
      />

      <ReactQuill
        value={content}
        onChange={(newContent) => setContent(newContent)}
        modules={modules}
      />

      <button style={{ marginTop: '5px' }}>Create post</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}


