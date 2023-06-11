const querystring = require('querystring')
const express = require('express')
const User = require('../models/user')
const { getAuthToken, refreshAuthToken } = require('../controllers/authorization')
const { getSpotifyPlaylists } = require('../controllers/playlists')
const { getUserSpotify } = require('../controllers/user')
const axios = require('axios')

const router = new express.Router()


router.get('/login' , async (req,res) => {
    const scope = 
    `user-library-modify
    user-read-private
    playlist-read-private
    playlist-modify-public`
    const stateString = Math.random().toString(36).substring(2,10)
    
    res.redirect('https://accounts.spotify.com/authorize?' + 
    querystring.stringify({
        response_type:'code' ,
        client_id: process.env.SPOTIFYAPIID,
        scope: scope,
        redirect_uri: process.env.SPOTIFYREDIRECTURI,
        state: stateString
        })
    )
})

router.get('/callback', async (req, res) => {
    try {
        const code = req.query.code || null;
        const state = req.query.state || null;
        if (state === null) {
            res.redirect('/#' + querystring.stringify({
                error: 'state_mismatch'
            }));
        } else {
            const authInfo = await getAuthToken(code)
            const accessToken = await authInfo.access_token
            const refreshToken = await authInfo.refresh_token

            const userSpotify = await getUserSpotify(accessToken)
            
            const user = await User.findOne({spotifyID: userSpotify.id})
            
            if(!user) {
                // This is where we make a post request to the user router
                
                const username = await userSpotify.display_name
                const userID = await userSpotify.id
                const newUser = { 
                    name: username,
                    spotifyID: userID,
                    tokens:{
                        spotifyToken: accessToken,
                        refreshToken: refreshToken
                    }
                }
                axios({
                    method:'post',
                    url:'http://localhost:8888/users',
                    data: newUser
                })
                .then(async (response) => {
                    const playlistData = await getSpotifyPlaylists(response.data.spotifyID)
                    axios({
                        method: 'patch',
                        url: `http://localhost:8888/users/${userID}`,
                        data: { playlists: playlistData }
                    })
                    .then(response => {
                        res.send(response)
                    })
                    
                })
            } else {
                //This is where we make an update request to the user router, and then a get request for the user playlists
                const tokens = {
                    spotifyToken: accessToken,
                    refreshToken: refreshToken
                }
                const userID = user.spotifyID
                axios ({
                    method: 'patch',
                    url: `http://localhost:8888/users/${userID}`,
                    data: {
                        tokens
                    }
                })
                .then(response => {
                    res.send(response)
                })
            }
            

        }
    } catch (e) {
        res.status(401).send(e)
    }
   
})

router.get('/refresh_token' , (req, res) => {
    

})

router.get('/logout' , async (req,res) => {
    res.redirect('https://accounts.spotify.com/logout') 
})

module.exports = router