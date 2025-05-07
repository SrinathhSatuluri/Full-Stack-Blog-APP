import { useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function register(ev) {
        ev.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                setRedirect(true);
            } else {
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    console.error('Registration failed:', errorData);
                } else {
                    const errorText = await response.text();
                    console.error('Registration failed with non-JSON response:', errorText);
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <form onSubmit={register}>
            <h1>Register</h1>
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
            <button type="submit">Register</button>
        </form>
    );
}





