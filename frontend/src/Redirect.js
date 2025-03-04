


export default function Redirect()
{
    const backend = process.env.REACT_APP_BACKEND;

    // validate url
    const params = new URLSearchParams(window.location.search);
    console.log(window.location);
    const code = params.get('code');
    const state = params.get('state');

    console.log('code:',code);
    console.log('state:',state);

    let status = false;

    if (code !== null && state !== null) 
    {
        // send post request to backend and redirect to home
        status = fetch(backend+'/auth/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code,
                state: state,
                redirect_uri: 'http://localhost:3000/callback'
            })
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            Object.entries(res).forEach(([k, v]) => {
                document.cookie = `${k}=${v}`;
            });
        })
        .then(() => window.location = 'home')
        .catch((error) => {
            console.error(error.message)
            window.location = 'error?msg=invalid credentials&redirect=/';
        });
    }
}