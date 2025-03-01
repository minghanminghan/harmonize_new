import Express from "express";
import mongoose from "mongoose";

// mongoose.connect('')

const app = Express();


// middleware
app.use(Express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method, req.params, req.query, req.body);
    next();
})

// base routes


const PORT = 4000;
app.listen(PORT => {
    console.log('listening on', PORT);
});