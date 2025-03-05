import { config } from "dotenv";
config();
import Express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { auth, client_id, client_secret, redirect_uri, scope } from "./auth.js";
import { user } from "./user.js";
import cookieParser from "cookie-parser";


const DB_URL = process.env.MONGOOSE_dsn
mongoose.connect(DB_URL).then(res => {
    console.log('connected to', DB_URL);
});


const app = Express();


app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(Express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    console.log();
    console.log(req.path, req.method, req.params, req.query);
    //console.log(req.cookies);
    //console.log(req.body);
    next();
});
app.use((req, res, next) => {
    if (req.cookies !== undefined && req.cookies.username !== undefined) {
        res.locals.username = req.cookies.username;
    }
    next();
});
app.use(async (req, res, next) => {
    if (req.path.split('/')[1] === 'auth') {
        return next();
    }
    // no refresh token, bad
    else if (req.cookies === undefined || req.cookies['Refresh'] === undefined) {
        res.status(400);
        return next('Unauthenticated (no refresh token)');
    }
    // yes refresh token
    else if (req.cookies['Refresh'] !== undefined && req.cookies['Authorization'] === undefined) {
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
            res.locals.Authorization = 'Bearer ' + String(data.access_token);
            res.cookie('Authorization', String(data.token_type) + ' ' + String(data.access_token), {
                // httpOnly: true, // turn this on for prod
                maxAge: 3600 * 1000,
                sameSite: true
            });
            return next();
        })
        .catch(err => {
            console.err(err.message);
            res.status(500);
            return next(err);
        });
    }
    // refresh and access token both exist
    else {
        res.locals.Authorization = req.cookies['Authorization'];
        next();
    }
});


// base routes
app.get('/', (req, res) => {
    res.send('api is running!');
});


// services
app.use('/auth', auth);
app.use('/user', user);

const PORT = 4000;
app.listen(PORT, () => {
    console.log('listening on port', PORT);
});


export {
    app
};