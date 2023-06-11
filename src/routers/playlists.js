const express = require('express')
const Playlist = require('../models/playlists')
const User = require('../models/user')
const { getPlaylistTracks } = require('../controllers/playlists')
const router = new express.Router()
const axios = require('axios')


router.post('/playlists', async (req, res) => {
    try{
        const userId= req.body.user.spotifyID
        const playlistId = req.body.playlistId
        const playlistName = req.body.playlistName
        const playlistTracks = await getPlaylistTracks(userId, playlistId)
        const playlist = new Playlist({
            name: playlistName,
            songs:playlistTracks,
            spotifyId: playlistId
        })
        await playlist.save()
        res.status(201).send(playlist)
    }catch (e) {
        res.status(400).send(e)
    }
})

router.get('/playlists/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findOne( { spotifyId:req.params.id })
        res.status(200).send(playlist)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/playlist/:id', async (req, res) => {
    try {
        const updates = {
            ...req.body
        }
        const playlist = await Playlist.findOneAndUpdate({ spotifyId: req.params.id }, updates )
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/playlists/:id' , async (req, res) => {
    try {
        await Playlist.findOneAndDelete({ spotifyId: req.params.id })
        res.status(200),send('Playlist successfully deleted!')
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router