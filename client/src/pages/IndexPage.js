import React, { useEffect, useState } from 'react';
import Post from '../pages/Post'; // Adjust the path as needed

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('http://localhost:4000/post');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false); // Stop loading once fetch is done
      }
    }

    fetchPosts();
  }, []);

  return (
    <div>
      {loading ? ( 
        <p>Loading posts...</p> // Show while loading
      ) : posts.length > 0 ? (
        posts.map(post => (
          <Post 
            key={post._id}
            title={post.title}
            author={post.author} // Ensure author is passed correctly
            date={post.publishedAt} // Pass publishedAt directly
            summary={post.summary}
            cover={post.cover} // Filename of the uploaded image
          />
        ))
      ) : (
        <p>No posts found</p>
      )}
    </div>
  );
}













