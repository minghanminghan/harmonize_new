import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../utils/AuthContext.js';
import TokenContext from '../utils/TokenContext.js';

const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://localhost:3000/callback';

export default function Redirect() {
    const { login } = useContext(AuthContext);
    const { setToken } = useContext(TokenContext);

    const code = String(window.location).split('=')[1];
    const authorization = window.btoa(String(client_id + ':' + client_secret));
    // console.log(authorization);
    useEffect(() => {
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authorization}`
            }
        })
        .catch(err => {
            console.log(err);
            // redirect to error page
            // window.location.href = '/error';
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
    
            login();
            setToken([res.access_token, res.refresh_token]);
    
            // set cookies
            document.cookie = `Authorization=Bearer ${res.access_token}; max-age=3600; path=/`;
            document.cookie = `Refresh=${res.refresh_token}`;
    
            // post refresh token to auth service
            fetch(process.env.REACT_APP_AUTH_SERVICE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access: `Bearer ${res.access_token}`,
                    refresh: res.refresh_token
                })
            });
            
            // redirect to home page
            window.location.href = '/home';
        });
    }, []);

    return (
        <div>
            callback
        </div>
    );
}