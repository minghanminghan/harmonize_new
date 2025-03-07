import { useState } from "react";
import { loginUrl, sp, setTokens } from "./utils/spotify.js"

export default function Login() {
    
    // const cookies = Object.fromEntries(document.cookie.split('; ').map(v => v.split('=')));
    // console.log(cookies);
    // if (cookies['Refresh'] !== undefined) { // logic to check signed in :(
    //     window.location = 'home';
    // }

    return (
        <div>
            <button onClick={() => {window.location = loginUrl}}>Sign In with Spotify</button>
        </div>
    );
}