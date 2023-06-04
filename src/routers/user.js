const express = require('express')
const querystring = require('querystring')
const User = require('../models/user')
const { getAuthToken, refreshAuthToken } = require('../controllers/authorization')
const { getUserSpotify } = require('../controllers/user')
const router = new express.Router()

router.get('/users/login' , async (req,res) => {
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

router.get('/users/callback', async (req, res) => {
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
                const username = await userSpotify.display_name
                const newUser = new User({ 
                    name: username,
                    spotifyID: userID,
                    tokens:{
                        spotifyToken:accessToken,
                        refreshToken:refreshToken
                    }
                })
                console.log(newUser)
                await newUser.save()
            } else {
                user.tokens.spotifyToken = accessToken
                user.tokens.refreshToken = refreshToken
                await user.save()
            }
        }
    } catch (e) {
        console.log(e)
    }
   
})


router.get('/users/refresh_token' , (req,res) => {

    refreshAuthToken(req.query.refresh_token)
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

router.get('/users/logout' , async (req,res) => {
    res.redirect('https://accounts.spotify.com/logout') 
})

module.exports = router

