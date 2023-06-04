const mongoose = require('mongoose')
const validator = require('validator')

const playlistsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        // ref: 'User'
    },
    songs:{
        type: Array,
        required: true
    },
    youtubeLink:{
        type: String,
        required: false,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Playlist link is invalid')
            }
        }
    },
    spotifyId: {
        type: String,
        required: true
    },
})

const Playlists = mongoose.model('Playlists', playlistsSchema)

module.exports = Playlists