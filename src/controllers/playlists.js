const axios = require('axios')
const User = require('../models/user')
const querystring = require('querystring')


const getSpotifyPlaylists = async (user_id) => {
    try{
    const user = await User.findOne({spotifyID : user_id})
    const access_token = user.tokens.spotifyToken
    const url = `https://api.spotify.com/v1/users/${user_id}/playlists`
    const playlistInfo = await axios.get(url, {
        headers: {
            'Authorization' : `Bearer ${access_token}`
        }})
    const playlistItems = await playlistInfo.items
    

    return userPlaylists
    // request.get(options, (error, response, body) => {
    //     if(!error){
    //         const playlists = body.items.map((item) => {
    //         return item.id
    //         })
    //         res.status()
    //     }
        
    // })
    } catch (e) {
        return e
    }
}

const getPlaylistTracks = async (user_id, playlist_id) => {
    try{
        const user = await User.findOne({spotifyID : user_id})
        const access_token = user.tokens.spotifyToken
        const url = 'https://api.spotify.com/v1/me/playlists'
    } catch (e) {

    }
}

module.exports = {
    getSpotifyPlaylists,
    getPlaylistTracks
}