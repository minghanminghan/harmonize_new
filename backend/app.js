import { config } from "dotenv";
config();
import Express from "express";
import mongoose from "mongoose";

import { auth, client_id, client_secret, redirect_uri, scope } from "./auth.js";
import { user } from "./user.js";
import cookieParser from "cookie-parser";


const DB_URL = process.env.MONGOOSE_dsn
mongoose.connect(DB_URL).then(res => {
    console.log('connected to', DB_URL);
});


const app = Express();
const route_map = {
    'favicon.ico': { authenticated: false },
    '': { authenticated: true },
    'auth': { authenticated: false },
    'user': { authenticated: true}
};

// middleware
app.use(Express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    console.log(req.path, req.method, req.params, req.query);
    //console.log(req.cookies);
    //console.log(req.body);
    next();
});
app.use(async (req, res, next) => {
    const route = route_map[req.path.split('/', 3)[1]];
    // console.log(route_map[req.path.split('/', 3)]);
    // invalid route
    if (route === undefined) {
        return next('non-existent route');
    }
    // no authentication needed
    else if (route['authenticated'] === false) {
        next();
    }
    // no refresh token
    else if (req.cookies === undefined || req.cookies['Refresh'] === undefined) {
        res.redirect('/auth/signup');
    }
    // yes refresh token
    else if (req.cookies['Refresh'] !== undefined && req.cookies['Authorization'] === undefined) {
        res.redirect('/auth/refresh');
    }
    // refresh and access token both exist
    else {
        res.locals.auth = req.cookies['Authorization'];
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