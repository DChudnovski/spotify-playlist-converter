const querystring = require('querystring')
const User = require('../models/user')
const { getAuthToken, refreshAuthToken } = require('../controllers/authorization')
const { getSpotifyPlaylists } = require('../controllers/playlists')
const { getUserSpotify } = require('../controllers/user')
const express = require('express')
const router = new express.Router()
const axios = require('axios')


router.get('/login' , async (req,res) => {
    const scope = 
    `user-modify-playback-state
    user-read-playback-state
    user-read-currently-playing
    user-library-modify
    user-library-read
    user-top-read
    playlist-read-private
    playlist-modify-public`
    const state = 'adweusnwefasdfe'

    res.redirect('https://accounts.spotify.com/authorize?' + 
    querystring.stringify({
        response_type:'code' ,
        client_id: process.env.SPOTIFYAPIID,
        scope: scope,
        redirect_uri: process.env.SPOTIFYREDIRECTURI,
        state: state
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
            const userID = await userSpotify.id

            const user = await User.findOne({spotifyID:userID})

            if(!user) {
                // This is where we make a post request to the user router  
                const username = await userSpotify.display_name
                const newUser = { 
                    name: username,
                    spotifyID: userID,
                    tokens:{
                        spotifyToken:accessToken,
                        refreshToken:refreshToken
                    }
                }
                const postResponse = axios({
                    method:'post',
                    url:'http://localhost:8888/users',
                    data: newUser
                })
                postResponse.then(async (response) =>{
                    const user_id = response.data.spotifyID
                    const playlistInfo = await getSpotifyPlaylists(user_id)
                    console.log(playlistInfo)

                    
                })
                .catch(async (e) => {
                    console.log(e)
                })
                
            } else {
                //This is where we make an update request to the user router
                // const tokens = {
                //     accessToken,
                //     refreshToken
                // }
                

                // const getResponse = await axios({
                    //     method:'get',
                    //     url:`/users/${user.spotifyID}`
                    // })
                    
                    // const responses = {
                        //     res1: patchResponse,
                        //     res2: getResponse
                        // }
                        // res.status(200).send()}

                }}
    } catch (e) {
        res.status(401).send(e)
    }
   
})

router.get('/refresh_token' , (req, res) => {

    refreshAuthToken(req.body.refresh_token)
    // const refresh_token = req.query.refresh_token   
    // const authOptions = {
    //     url: 'https://accounts.spotify.com/api/token',
    //     headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFYAPIID + ':' + process.env.SPOTIFYAPISECRET).toString('base64')) },
    //     form: {
    //         grant_type: 'refresh_token',
    //          refresh_token: refresh_token
    //     },
    //     json: true
    // }
    // request.post(authOptions, (error, response, body) => {
    //     if(!error && response.statusCode === 200) {
    //         const access_token = body.access_token
    //         res.send({
    //             'access_token': access_token
    //         })
    //     }
    // })
})

module.exports = router