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
    const playlistItems = await playlistInfo.data.items
    const playlistArray = []
    playlistItems.forEach(item => {
        const x = {
            playlistName:item.name,
            playlistId: item.id,
            href: item.href
        }
        playlistArray.push(x)
    })
    
    return playlistArray

    } catch (e) {
        return e
    }
}

const getPlaylistTracks = async (user_id, playlist_id) => {
    try{
        const user = await User.findOne({spotifyID : user_id})
        const access_token = user.tokens.spotifyToken
        const url = `https://api.spotify.com/v1/playlists/${playlist_id}`
        const tracksArray = []
        const playlistTracks = await axios.get(url, {
            headers: {
                'Authorization' : `Bearer ${access_token}`
            }
        })
        playlistTracks.items.forEach(item => {
            const playlistItem = `${item.track.name} ${item.track.artists[0].name}`
            tracksArray.push(playlistItem)
        })
        return tracksArray
    } catch (e) {
        return e
    }
}

module.exports = {
    getSpotifyPlaylists,
    getPlaylistTracks
}