import { config } from "dotenv";
config();
import Express from "express";
import { User } from "./db/schema.js";

const auth = Express.Router();


// constants
const client_id = process.env.SPOTIFY_client_id;
const client_secret = process.env.SPOTIFY_client_secret;
const redirect_uri = process.env.SPOTIFY_redirect_uri;
const scope = 'user-read-private user-read-email';


auth.get('/refresh', async (req, res, next) => {
    // console.log('expired access token');
    await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        body: `grant_type=refresh_token&refresh_token=${req.cookies['Refresh']}`
    })
    .then(res => res.json())
    .then(data => {
        res.locals.auth = 'Bearer ' + String(data.access_token);
        res.cookie('Authorization', String(data.token_type) + ' ' + String(data.access_token), {
            // httpOnly: true, // turn this on for prod
            maxAge: 3600 * 1000,
            sameSite: true
        });
        return next();
    })
    .catch(err => {
        console.err(err.message);
        return next(err);
    });
});


auth.get('/login', (req, res) => {
    // console.log('no refresh token');
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri+'/login',
        state: Buffer.from(String(Date.now())).toString('base64') // not random but unique
    });
    res.redirect('https://accounts.spotify.com/authorize?' + params.toString());
});


auth.get('/signup', (req, res) => {
    // console.log('no refresh token');
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri+'/signup',
        state: Buffer.from(String(Date.now())).toString('base64') // not random but unique
    });
    res.redirect('https://accounts.spotify.com/authorize?' + params.toString());
});


auth.post('/callback', async (req, res) => {
    if (req.body === undefined) {
        res.status(400).send('invalid request');
        return;
    } else if (req.body.code === undefined) {
        res.status(400).send('missing code');
        return;
    } else if (req.body.redirect_uri === undefined) {
        res.status(400).send('missing redirect_uri');
        return;
    }

    const [status, data] = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        body: `code=${req.body.code}&redirect_uri=${req.body.redirect_uri}&grant_type=authorization_code`,
        json: true
    })
    .then(res => res.json())
    .then(data => {
        console.log('data:',data);
        res.locals.Authorization = 'Bearer ' + String(data.access_token);
        res.status(200);
        return [true, {
            Refresh: data.refresh_token + '; path=/',
            Authorization: data.token_type + ' ' + data.access_token + '; path=/; max-age=5'
        }];
    })
    .catch(err => {
        console.error('error',err);
        res.status(404)
        return [false, err.message];
    });

    // add user to db (really hacked)
    if (status) {
        await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: { Authorization: res.locals.Authorization }
        })
        .then(res => res.json())
        .then(user_info => user_info.display_name)
        .then(username => {
            return [username, User.findOne({ username: username })];
        })
        .then(([username, user]) => {
            if (user === null) {
                User.create({ username: username })
            }
            data.username = username + '; path=/';
        })
        .catch(err => {
            console.err(err.message);
        });
    }
    // console.log(data);
    res.send(data);
});


// auth.post('/access', async (req, res) => {
//     const user = await User.findOne({ username: req.body.username });
//     res.send(user.authorization);
// });

// auth.get('/callback/:status', async (req, res) => {
//     if (req.query.state === null) {
//         res.status(404).send();
//     } else if (req.query.error !== undefined ) {
//         res.status(404).send(req.query.error);
//     }
//     else {
//         await fetch('https://accounts.spotify.com/api/token', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
//             },
//             body: `code=${req.query.code}&redirect_uri=${redirect_uri}/${req.params.status}&grant_type=authorization_code`,
//             json: true
//         })
//         .then(res => res.json())
//         .then(data => {
//             console.log(data);
//             res.locals.auth = 'Bearer ' + String(data.access_token);
//             res.cookie('Refresh', String(data.refresh_token), {
//                 // httpOnly: true
//             });
//             res.cookie('Authorization', String(data.token_type) + ' ' + String(data.access_token), {
//                 // httpOnly: true, // turn this on for prod
//                 maxAge: 3600 * 1000
//             });
//             return data.refresh_token;
//         })
//         .catch(err => {
//             console.err(err.message);
//             res.status(404).send(err.message);
//             throw new Error(err.message);
//         });
//         console.log(res.locals.auth);
//         if (req.params.status === 'signup') {
//             const user_info = await fetch('https://api.spotify.com/v1/me', {
//                 method: 'GET',
//                 headers: { Authorization: res.locals.auth }
//             })
//             .then(res => res.json())
//             .catch(err => {
//                 console.err(err.message);
//                 res.status(404).send(err.message);
//                 throw new Error(err.message);
//             });
//             console.log(user_info);
//             await User.create({ username: user_info.display_name });
//         }
//         res.redirect('/user/');
//     }
// });


export {
    auth,
    client_id,
    client_secret,
    redirect_uri,
    scope
};