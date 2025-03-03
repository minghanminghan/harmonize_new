import Express from "express";
import { User } from "./db/schema.js";


const user = Express.Router();


user.get('/', async (req, res) => {
    // console.log(res.locals.auth);
    const user_info = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: { Authorization: res.locals.auth }
    })
    .then(res => res.json())
    .catch(err => {
        res.status(404).send(err.message);
        throw new Error(err.message);
    });

    // console.log(user_info);
    const user = await User.findOne({ username: user_info.display_name }).lean();
    res.send(user);
});


user.post('/', async(req, res) => {
    const user_info = await get_user_info(res.locals.auth);
    const user = await User.create({ username: user_info.display_name });
    res.send(user);
});


export {
    user
};