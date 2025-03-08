import SpotifyWebApi from "spotify-web-api-node";


export const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
export const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const scope = process.env.REACT_APP_SPOTIFY_SCOPE;
export const redirect_uri = 'http://localhost:3000/callback';


export const authEndpoint = 'https://accounts.spotify.com/authorize';
export const loginUrl = `${authEndpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=code&show_dialogue=true`;


export const sp = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri
});


export async function setTokens() {
    await fetch(loginUrl)
    .then(res => res.text())
    .catch(err => console.error(err));
}