import { createContext, useState } from 'react';

// Create UserContext
export const UserContext = createContext({});

// UserContextProvider to manage user state
export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
}


