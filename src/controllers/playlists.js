const axios = require('axios')
const User = require('../models/user')
const querystring = require('querystring')


const getSpotifyPlaylists = async (user_id) => {
    try{
    const user = User.findOne({spotifyID : user_id})
    const access_token = user.tokens.spotifyToken
    const url = 'https://api.spotify.com/v1/me/playlists'

    const playlistInfo = await axios.get(url, {
        headers: {
            'Authorization' : `Bearer ${access_token}`
        }})

    console.log(playlistInfo.data)

    // request.get(options, (error, response, body) => {
    //     if(!error){
    //         const playlists = body.items.map((item) => {
    //         return item.id
    //         })
    //         res.status()
    //     }
        
    // })
    } catch (e) {
        // res.status(400).send(e)
    }
}

const createPlaylist = async (req, res) => {

}

module.exports = {
    getSpotifyPlaylists
}