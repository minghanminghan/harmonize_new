import { useState } from "react";
import axios from "axios";

const backend = process.env.REACT_APP_BACKEND;

// implement sse

export default function App() {

    const [friends, setFriends] = useState([]);
    const [friend_requests, setFriendRequests] = useState([]);
    const [algos, setAlgos] = useState([]);

    axios.get('http://localhost:4000/user/', {
        withCredentials: true
    })
    .then(res => res.data)
    .then(res => console.log(res));



    return (
        <div>
            {friends}
            {friend_requests}
            {algos}
        </div>
    );
}