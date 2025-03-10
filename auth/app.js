import Express from "express";
import cors from "cors";


const app = Express();
app.use(cors());
app.use(Express.json());
app.use((req, res, next) => {
    console.log(Date.now(), req.method, req.path, req.body);
    next();
});


app.get('/', (req, res) => {
    res.send('auth service is running!');
});


let refresh, access, expiry;


app.get('/access', async (req, res) => {
    if (refresh === undefined || 'undefined' in req.body) {
        res.status(400).send();
        return;
    }
    else if (Date.now() > expiry) { // check if access token is valid
        // set new access token
        access = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: clientId
            }),
        })
        .then(res => res.json())
        .then(res => `Bearer ${res.access_token}`);
        expiry = Date.now();
    }
    res.status(200).json({ access_token: access }); // send access token
});


app.post('/', (req, res) => { // { refresh: 'Bearer ...', access: str } <-- convert on client side
    refresh = req.body.refresh;
    access = req.body.access;
    expiry = Date.now() + 3600*1000; // 1 hour from receiving token
});


const PORT = 4001;
app.listen(PORT, () => {
    console.log('listening on',PORT);
});