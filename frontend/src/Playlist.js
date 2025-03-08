import "./css/Playlist.css";
import { useNavigate } from "react-router-dom";

// subscribe to context for web player

export default function Playlist({ props }) {
    const navigate = useNavigate();
    // console.log(props);

    return (
    <div className='playlist wrapper outline'>
        <img src={props.images[0].url} onClick={() => {navigate(`/extend`, { state: props})}}/>
        <p>{props.name}</p>
        <p>length: {props.tracks.total}</p>
        <a href={props.external_urls.spotify} target='_blank'>link</a>
        { /*<p></p>*/ }
    </div>
    );
}

