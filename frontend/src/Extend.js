import "./css/Extend.css";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import TokenContext from "./utils/TokenContext.js";
import axios from "axios";

export default function Extend() {
    const { token } = useContext(TokenContext);
    const props = useLocation().state;
    const [tracks, setTracks] = useState([]);
    const [playing, setPlaying] = useState(null);

    useEffect(() => {
        axios.get(`https://api.spotify.com/v1/playlists/${props.id}`, {
            headers: { Authorization: token }
        })
        .then(res => res.data.tracks)
        .then(res => {
            console.log(res);
            let tmp_tracks = [];
            for (let item of res.items) {
                tmp_tracks.push(<Track key={item.track.id} props={item.track} />);
            }
            setTracks(tmp_tracks);
        });
    }, []);

    function handleDrop(e) {
        e.preventDefault();
        
        if (!e.target.classList.contains('droppable')) {
            return;
        }
        const idx1 = tracks.findIndex(v => v.key === e.dataTransfer.getData('text'));
        const idx2 = tracks.findIndex(v => v.key === e.target.getAttribute('name'));
        // console.log(idx1, idx2);
        let tmp_tracks = [...tracks]; // swap elements
        const tmp = tmp_tracks[idx1];
        tmp_tracks[idx1] = tmp_tracks[idx2];
        tmp_tracks[idx2] = tmp;
        // console.log(idx1, idx2);
        setTracks(tmp_tracks);
    }

    function handleClick(e) { // send ids to rec service
        e.preventDefault();

        fetch(process.env.REACT_APP_REC_SERVICE+'/rec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: tracks.map(v => v.key) })
        })
        .catch(err => console.log(err))
        .then(res => res.json())
        .then(res => console.log(res));
    }

    return (
        <div className='extend'>
            <div className='playlist flex_row'>
                <img src={props.images[0].url} />
                <div className='playlist flex_col'>
                    <p>{props.name}</p>
                    <p>owner: {props.owner.display_name}</p>
                    <p>description: {props.description} </p>
                    <p>length: {props.tracks.total}</p>
                    <a href={props.external_urls.spotify} target='_blank'>link</a>
                </div>
                <button onClick={handleClick}>Extend</button>
            </div>
            <div onDrop={handleDrop} onDragOver={(e) => {e.preventDefault()}}>
                { tracks }
            </div>
        </div>
    );
}

function Track({ props }) {
    const ref = useRef(null);
    const artists = props.artists.map(v => v.name);

    return (
        <div id={props.id} className='track wrapper droppable' name={props.id} ref={ref} draggable={true} onDragStart={(e) => {e.dataTransfer.setData('text', props.id);}} style={{zIndex: 1}} >
            <p className='droppable' name={props.id}>Name: { props.name }</p>
            <p className='droppable' name={props.id}>Artist: { artists.join(', ') }</p>
            <p className='droppable' name={props.id}>Album: { props.album.name }</p>
            <p className='droppable' name={props.id}>Duration: { Math.floor(props.duration_ms / 1000 / 60) }:{ ('0' + Math.floor(props.duration_ms / 1000 % 60)).slice(-2) }</p>
        </div>
    );
}