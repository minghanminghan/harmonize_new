import { useState, useEffect } from "react";
import axios from "axios";

const track = {
    name: "Butterflies",
    album: {
        images: [
            { url: "https://i.scdn.co/image/ab67616d0000b273f922300411db724163aa8eda" }
        ]
    },
    artists: [
        { name: "TV Girl" }
    ]
}

// TODO: redo auth so web player can get access token, this is so scuffed
const cookies = Object.fromEntries(document.cookie.split('; ').map(v => v.split('=')));
const access = cookies['Authorization'].slice(9);


export default function () {

    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
    
        window.onSpotifyWebPlaybackSDKReady = () => {
            //console.log('hi);
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(access); },
                volume: 0.5
            });
    
            setPlayer(player);
    
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
            player.addListener('player_state_changed', ( state => {
                console.log(state);
                if (!state) {
                    return;
                }
                setTrack(state.track_window.current_track);
                setPaused(state.paused);
                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });
            }));
            
            player.connect().then(success => {
                console.log(success);
                // console.log(player);
            });
        };
    }, []);

    return (
    <>
    <div className="container">
    <div className="main-wrapper">
        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />
        <div className="now-playing__side">
            <div className="now-playing__name">{current_track.name}</div>
            <div className="now-playing__artist">{current_track.artists[0].name}</div>
        </div>
        <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
            &lt;&lt;
        </button>
        <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
            { is_paused ? "PLAY" : "PAUSE" }
        </button>
        <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
            &gt;&gt;
        </button>
    </div>
    </div>
     </>
    );
}