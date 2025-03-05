import Express from "express";
import { Algo, User } from "./db/schema.js";


const user = Express.Router();


user.get('/', async (req, res) => {
    const user = await User.findOne({ username: res.locals.username }).lean();
    
    const friends = await User.find({_id: {$in: user.friends }});

    const friend_requests = await User.find({_id: {$in: user.friend_requests }});

    const algos = await Algo.find({_id: {$in: user.algos }});

    res.send({
        friends: friends,
        friend_requests: friend_requests,
        algos: algos
    });
});

user.get('/spotify', async (req, res) => {
    const data = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: res.locals.Authorization
        }
    })
    .then(res => res.json());
    res.json(data);
});


user.post('/', async(req, res) => {
    const user_info = await get_user_info(res.locals.auth);
    const user = await User.create({ username: user_info.display_name });
    res.send(user);
});


export {
    user
};