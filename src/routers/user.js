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
        res.status(400).send(e)
    }
})

router.get('/users/:id', async (req, res) => {
    try{
        const user = await User.findOne({ spotifyID : req.params.id })
        res.status(200).send(user)
    } catch (e){
        res.status(400).send(e)
    }
    
})

router.patch('/users/:id' , async (req, res) => {
    try{
        const updates = {...req.body}
        const user = await User.findOneAndUpdate({spotifyID: req.params.id},updates)
        await user.save()
        res.status(202).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try{
        const user = await User.findOneAndDelete({spotifyId: req.params.id})
        res.status(202).send(user)

    } catch (e) {
        res.status(400).send(e)
    }
})



module.exports = router

