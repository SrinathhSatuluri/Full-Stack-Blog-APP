import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../userContext'; // Import UserContext

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(null); // State to hold error message
    const { setUserInfo } = useContext(UserContext); // Access setUserInfo from UserContext

    // Login function
    async function login(ev) {
        ev.preventDefault();
        setError(null); // Clear previous errors
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            const contentType = response.headers.get('Content-Type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const errorText = await response.text();
                throw new Error(`Unexpected response format: ${errorText}`);
            }

            if (response.ok && data.status === 'ok') {
                setUserInfo(data.user); // Update UserContext with user info
                setRedirect(true);
            } else {
                setError(data.error || 'Login failed'); // Set error message if available
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError(error.message || 'An error occurred during login');
        }
    }

    // Redirect after successful login
    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <form onSubmit={login}>
            <h1>Login</h1>
            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={ev => setUsername(ev.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={ev => setPassword(ev.target.value)} 
            />
            <button type="submit">Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        </form>
    );
}


