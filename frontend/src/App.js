import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./css/App.css";
import Playback from "./components/Playback.js";
import Playlist from "./Playlist.js";
import TokenContext from './utils/TokenContext.js';

// implement sse

export default function App() {

    const [cookies, setCookies] = useState({});
    const [playlists, setPlaylists] = useState([]);
    const { token, setToken } = useContext(TokenContext);
    
    useEffect(() => {
        const tmp_cookies = Object.fromEntries(document.cookie.split('; ').map(v => v.split('=')));
        console.log(tmp_cookies);
        setCookies(tmp_cookies);
        setToken(tmp_cookies.Authorization);
        // if (tmp_cookies.Authorization) {
        //     sp.setAccessToken(tmp_cookies.Authorization.split(' ')[-1]);
        // }
        // if (tmp_cookies.Refresh) {
        //     sp.setRefreshToken(tmp_cookies.Refresh);
        // }

        axios.get(`https://api.spotify.com/v1/users/${tmp_cookies.username}/playlists`, {
            headers: {
                Authorization: tmp_cookies.Authorization
            }
        })
        .then(res => res.data)
        .then(res => {
            console.log(res);
            let tmp_playlists = []; // if >50 playlists, iteratively fetch next? or is limiting size ok
            for (let item of res.items) {
                tmp_playlists.push(<Playlist key={item.id} props={item} />);
            }
            setPlaylists(tmp_playlists);
        });
    }, []);
    

    return (
        <div className='app grid_auto_rows'>
            {/* token ? <Playback access_token={token} /> : <></> */}
            { cookies.Authorization ? playlists : <></> }
        </div>
    );

}