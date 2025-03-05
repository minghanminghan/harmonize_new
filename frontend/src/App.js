import { useEffect, useState } from "react";
import axios from "axios";
import Search from "./components/Search";
import Playback from "./components/Playback";

const backend = process.env.REACT_APP_BACKEND;

// implement sse

export default function App() {

    const [friends, setFriends] = useState([]);
    const [friend_requests, setFriendRequests] = useState([]);
    const [algos, setAlgos] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/user/', {
            withCredentials: true
        })
        .then(res => res.data)
        .then(res => {
            console.log(res);
            
            // map response
            setFriends(res.friends);
            setFriendRequests(res.friend_requests);
            setAlgos(res.algos);
            return;
        });
    }, []);

    async function getSpotify() {
        await axios.get('http://localhost:4000/user/spotify', {
            withCredentials: true
        })
        .then(res => console.log(res.data));
    }

    return (
        <>
            <button>Sign Out</button>
            <Search />
            <button onClick={getSpotify}>Get Spotify Account Info</button>
            <List name="Friends" data={friends} display={['username', 'highlight']} />
            <List name="Friend Requests" data={friend_requests} display={['username', 'highlight']} />
            <List name="Algos" data={algos} display={['name']} />
            <Playback />
        </>
    );
}

function List({...props}) { // props.name, props.data, props.display (subset of data)
    let display = [];
    for (let obj of props.data) {
        let inner = [];
        for (let key of props.display) {
            if (obj[key] !== undefined) {
                inner.push(obj[key]);
            }
        }
        display.push(inner)
    }

    return (
        <div>
            <b>{props.name}</b>
            <p>{display}</p>
        </div>
    );
}