import { useEffect, useState } from "react";
import axios from "axios";
import { sp } from "./utils/spotify.js";
import "./css/App.css";
import Playback from "./components/Playback.js";
import Playlist from "./Playlist.js";

// implement sse

export default function App() {

    const [token, setToken] = useState(null); // only refresh!
    const [playlists, setPlaylists] = useState([]);
    
    useEffect(() => {
        async function getToken() {
            const res = await fetch(process.env.REACT_APP_AUTH_SERVICE+'/refresh').then(res => res.json());
            setToken(res.access_token);
            // console.log(res.access_token);
            sp.setAccessToken(res.access_token.split(' ')[1]);
            sp.getUserPlaylists().then(res => {
                console.log(res);
                let tmp_playlists = []; // if >50 playlists, iteratively fetch next? or is limiting size ok
                for (let item of res.body.items) {
                    tmp_playlists.push(<Playlist key={item.id} props={item} />);
                }
                setPlaylists(tmp_playlists);
            });
        }
        getToken();
    }, []);

    

    return (
        <div className='app grid_auto_rows'>
            {/* token ? <Playback access_token={token} /> : <></> */}
            { token ? playlists : <></> }
        </div>
    );


    // const [friends, setFriends] = useState([]);
    // const [friend_requests, setFriendRequests] = useState([]);
    // const [algos, setAlgos] = useState([]);

    // useEffect(() => {
    //     axios.get('http://localhost:4000/user/', {
    //         withCredentials: true
    //     })
    //     .then(res => res.data)
    //     .then(res => {
    //         console.log(res);
            
    //         // map response
    //         setFriends(res.friends);
    //         setFriendRequests(res.friend_requests);
    //         setAlgos(res.algos);
    //         return;
    //     });
    // }, []);

    // async function getSpotify() {
    //     await axios.get('http://localhost:4000/user/spotify', {
    //         withCredentials: true
    //     })
    //     .then(res => console.log(res.data));
    // }

    // return (
    //     <>
    //         <button>Sign Out</button>
    //         <button onClick={getSpotify}>Get Spotify Account Info</button>
    //         <List name="Friends" data={friends} display={['username', 'highlight']} />
    //         <List name="Friend Requests" data={friend_requests} display={['username', 'highlight']} />
    //         <List name="Algos" data={algos} display={['name']} />
    //         <Playback />
    //     </>
    // );
}

// function List({...props}) { // props.name, props.data, props.display (subset of data)
//     let display = [];
//     for (let obj of props.data) {
//         let inner = [];
//         for (let key of props.display) {
//             if (obj[key] !== undefined) {
//                 inner.push(obj[key]);
//             }
//         }
//         display.push(inner)
//     }

//     return (
//         <div>
//             <b>{props.name}</b>
//             <p>{display}</p>
//         </div>
//     );
// }