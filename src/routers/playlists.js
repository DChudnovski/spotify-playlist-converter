const express = require('express')
const Playlist = require('../models/playlists')
const { getSpotifyPlaylists } = require('../controllers/playlists')
const router = new express.Router()
const axios = require('axios')



router.get('/playlists/:access_token' , async (req, res) => {
    
        try{
        const access_token = req.params.access_token
        const options = {
            url: 'https://api.spotify.com/v1/me/playlists',
            headers: { 'Authorization': `Bearer ${access_token}` }
          };
    
        const data = await axios.get(options)
    
        console.log(data)
    
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
    



    // try{
    // const access_token = req.params.access_token
    // const options = {
    //     url: 'https://api.spotify.com/v1/me/playlists',
    //     headers: { 'Authorization': `Bearer ${access_token}` },
    //     json: true
    //   };

    // request.get(options, (error, response, body) => {
    //     if(!error){
    //         const playlists = body.items.map((item) => {
    //         return item.id
    //         })
    //         res.status()
    //     }
        
    // })
    // } catch (e) {
    //     // res.status(400).send(e)
    // }
})


/* Thoughts about the logic of this endpoint
    
    This endpoint should look at a playlist currently in the database and determine whether or not a youtube playlist exists already,
    if it does it should redirect to the youtube playlist in question (or open it in a new window).
    if it does not then it should redirect to a post route for the playlist router that creates a new playlist item in the database, queries the spotify API for the track information of the playlist, creates a youtube playlist, searches for the songs by title in youtube (pushing them into the playlist one by one) and saves the youtube URL in the database, and then opens it after creating the youtube playlist.
*/
router.get('/playlists/:playlistID', async (req, res) => {
    try{
        const playlistId = req.params.playlistID
        const playlistInfo = await Playlist.findOne({spotifyId : playlistId}) || null
        const access_token = req.body.access_token
        const options = {
            url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            headers: { 'Authorization' : `Bearer ${access_token}`}
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/playlists', async (req,res) => {
    const playlistInfo = await getPlaylistInfo()
    const playlist = new Playlist({
        ...req.body,
        // owner: req.user._id
        songs: playlistInfo
    })
    try{
        await playlist.save()
        res.status(201).send('New Playlist Saved!')
    } catch (e) {
        res.status(400).send(e)
    }
})

// router.get('/playlists/:id' , async (req,res) => {
//     try {
//         const playlistInfo = await Playlist.findById(req.params.id)
//         const playlist = playlistInfo.songs
//         res.status(200).send(playlist)
//     }catch (e) {
//         res.status(500).send(e)
//     }
// })

// router.patch('/playlists/:id' , async (req,res) => {
//     try{

//     }catch (e) {

//     }
// })

// router.delete('/playlists/:id' , async (req, res) => {
//     try {
//         await Playlist.findByIdAndDelete(req.params.id)
//         res.status(200),send('Playlist successfully deleted!')
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

module.exports = router