import React from 'react';

export default function Post({_id,title, author, date, summary, cover }) {
  return (
    <div className="post">
      <div className="image">
        <Link to={'/post/${_id}'}>

        <img 
            src={`http://localhost:4000/uploads/${cover}`} 
            alt={title || 'Post cover image'}
          />
        </Link>
      </div>
      <div className="texts">
      <Link to={'/post/${_id}'}>
        <h2>{title}</h2>
        </Link>
        <p className="info">
          <span className="author">{author || 'Unknown Author'}</span>
          <time dateTime={date}>
            {date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
          </time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}











