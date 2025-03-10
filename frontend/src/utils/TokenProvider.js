import React, { useState, useContext, useEffect } from 'react';
import TokenContext from './TokenContext.js';
import { AuthContext } from './AuthContext.js';

const TokenProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const { isLoggedIn, logout } = useContext(AuthContext);
    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        async function fetchToken() {
            console.log('hi');
            await fetch(process.env.REACT_APP_AUTH_SERVICE+'/access')
            .then(res => res.json())
            .then(res => {
                setToken(res.access_token);
            })
            .catch(() => logout());
        }

        const intervalId = setInterval(() => {
            fetchToken();
        }, 1000);

        return () => clearInterval(intervalId);
    }, [token, isLoggedIn]);

    
    return (
        <TokenContext.Provider value={{ token, setToken }}>
        {children}
        </TokenContext.Provider>
    );
};

export default TokenProvider;