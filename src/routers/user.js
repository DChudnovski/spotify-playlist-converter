const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User({
        ...req.body
    })
    try{
        await user.save()
        res.status(201).send(user)
    } catch(e){
        res.status(400).send
    }
})

router.get('/users/:id', async (req, res) => {
    try{
        res.status(200).send()
    } catch (e){
        res.status(400).send()
    }
    
})

router.patch('/users/:id' , async (req, res) => {
    try{
        const user = await User.findOneAndUpdate({spotifyID: req.params.id},{...req.body})

    } catch (e) {

    }
})

router.delete('/users/:id', async (req, res) => {
    try{
        const user = await User.findOneAndDelete({spotifyId: req.params.id})
    } catch (e) {
        
    }
})



router.get('/logout' , async (req,res) => {
    res.redirect('https://accounts.spotify.com/logout') 
})

module.exports = router

