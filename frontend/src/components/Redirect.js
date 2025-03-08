import { client_id, client_secret, redirect_uri, loginUrl, sp, setTokens } from "../utils/spotify.js"

export default function Redirect()
{
    const code = String(window.location).split('=')[1];
    const authorization = window.btoa(String(client_id + ':' + client_secret));
    console.log(authorization);
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authorization}`
        }
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        sp.setAccessToken(res.access_token);

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
    })
    .catch(err => {
        console.log(err);
        // redirect to error page
    });
    return (
        <div>
            callback
        </div>
    );
}