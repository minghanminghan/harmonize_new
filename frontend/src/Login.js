import { useState } from "react";


const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const scope = process.env.REACT_APP_SPOTIFY_SCOPE;


export default function Login() {
    const cookies = Object.fromEntries(document.cookie.split('; ').map(v => v.split('=')));
    console.log(cookies);
    if (cookies['Refresh'] !== undefined) { // logic to check signed in :(
        window.location = 'home';
    }
    
    function fn(e) {
        e.preventDefault();

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: 'http://localhost:3000/callback', //redirect_uri+'/auth/callback/'+mode,
            state: String(Date.now()).toString('base64') // not random but unique
        });
        window.location = 'https://accounts.spotify.com/authorize?'+params;
    }

    return (
        <div>
            <button value='signup' onClick={e => fn(e)}>Sign Up</button>
            <button value='login'>Log In</button>
        </div>
    );
}