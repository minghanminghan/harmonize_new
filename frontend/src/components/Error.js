

export default function Error() {

    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
    const redirect = params.get('redirect');

    return (
        <div>
            <button onClick={() => {window.location = redirect}}>Back</button>
            Error: {msg}
        </div>
    );
}