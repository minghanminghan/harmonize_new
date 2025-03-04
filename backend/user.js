import Express from "express";
import { User } from "./db/schema.js";


const user = Express.Router();


user.get('/', async (req, res) => {
    const user = await User.findOne({ username: res.locals.username }).lean();
    const friends = await User.find({_id: {$in: user.friends }})
    res.send(friends);
    // TODO: aggregate!!
});


user.post('/', async(req, res) => {
    const user_info = await get_user_info(res.locals.auth);
    const user = await User.create({ username: user_info.display_name });
    res.send(user);
});


export {
    user
};