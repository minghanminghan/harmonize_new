import mongoose from "mongoose";

// embed everything

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
     }],
    friend_requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    highlight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        default: null
    },
    algos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    methods: {
        async validate_friend_request(id) {
            if (id in this.friends) {
                return false;
            } else if (id in this.friend_requests) {
                return false;
            } else {
                this.friend_requests.push(id);
                await this.save();
                return true;
            }
        },
        async add_friend(id) {
            const index = this.friend_requests.findIndex(id);
            if (index === -1) { // id not in this.friend_requests
                return false;
            } else {
                this.friends.push(this.friend_requests[index]);
                this.friend_requests.splice(index, 1);
                await this.save();
                return true;
            }
        }
    }
});
const User = mongoose.model('User', UserSchema);


const SongSchema = new mongoose.Schema({
    uri: { type: String, required: true, unique: [true, 'URI must be unique'] },
    name: { type: String, required: true },
    artist: { type: String, required: true },
    // TODO: implement features for query + recommendation
});
const Song = mongoose.model('Song', SongSchema);


const AlgoSchema = new mongoose.Schema({
    // TODO: implement this
    name: { type: String, required: true }
});
const Algo = mongoose.model('Algo', AlgoSchema);

export {
    User,
    Song,
    Algo
}