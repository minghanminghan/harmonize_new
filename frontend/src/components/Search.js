import { useRef } from "react";

export default function Search() {
    const textInput = useRef('');

    function handleSubmit(e) {
        e.preventDefault();
        console.log(textInput.current.value);
        // TODO: implement search in backend
        // also: decide on what to search for (users? songs?) 
    }

    return (
    <div>
        <form onSubmit={handleSubmit}>
            <input type="text" ref={textInput} />
            <button type="submit">Search</button>
        </form>
    </div>
    );
}