const axios = require('axios')
const User = require('../models/user')


const getUserSpotify = async (access_token) => {
    const url = 'https://api.spotify.com/v1/me'
    const headers = {
        'Authorization' : `Bearer ${access_token}`
    }
    const userInfo = await axios.get(url, {headers})

    return userInfo.data
}

module.exports = {
    getUserSpotify
}