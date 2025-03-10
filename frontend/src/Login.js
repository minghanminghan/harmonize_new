const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const scope = process.env.REACT_APP_SPOTIFY_SCOPE;
const redirect_uri = 'http://localhost:3000/callback';


const authEndpoint = 'https://accounts.spotify.com/authorize';
const loginUrl = `${authEndpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=code&show_dialogue=true`;

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