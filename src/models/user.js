const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    spotifyID:{
        type:String
    },
    tokens: {
        spotifyToken:{
            type: String
        },
        refreshToken: {
            type: String
        }
    },
    playlists: {
        type: Array
    }
},{
    timestamps: true
})

const User = mongoose.model('User' ,userSchema)

module.exports = User