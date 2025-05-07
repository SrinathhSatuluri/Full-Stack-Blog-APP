import './App.css';
import { Route, Routes, Link, Outlet, useNavigate } from 'react-router-dom';
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import React, { useEffect, useContext } from 'react';
import { UserContextProvider, UserContext } from './userContext';
import CreatePost from './pages/CreatePost';

// Main component that uses the context
function MainApp() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();  // Initialize useNavigate hook

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',  // Ensure cookies are sent with the request
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch profile');
        }
      })
      .then(userInfo => {
        setUserInfo(userInfo);  // Set user info in context
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        setUserInfo(null);  // Clear user info on error (or when not logged in)
      });
  }, [setUserInfo]);

  function logout(e) {
    e.preventDefault();
    fetch('http://localhost:4000/logout', {
      credentials: 'include',  // Ensure the cookie gets sent
      method: 'POST',
    }).then(() => {
      setUserInfo(null);  // Clear userInfo after logout
      navigate('/login');  // Redirect to login page after logout
    }).catch((error) => {
      console.error('Error logging out:', error);  // Handle logout errors
    });
  }

  const username = userInfo?.username;

  return (
    <main>
      <header>
        <Link to="/" className="logo">MyBlog</Link>
        <nav>
          {username ? (
            <>
              <Link to="/create">Create new post</Link>
              <a href="/" onClick={logout}>Logout</a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <Outlet />
    </main>
  );
}

// App component
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route 
          path="/" 
          element={<MainApp />}
        >
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:_id" element={<PostPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;





