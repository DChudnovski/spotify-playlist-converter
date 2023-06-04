const axios = require('axios')
const { query } = require('express')
const querystring = require('querystring')

const getAuthToken = async (code) => {
    try{
        const url = 'https://accounts.spotify.com/api/token'
        const tokenParams = Buffer.from(`${process.env.SPOTIFYAPIID}:${process.env.SPOTIFYAPISECRET}` , 'utf-8').toString('base64')
        const data =  querystring.stringify({
            'code': code,
            'redirect_uri':process.env.SPOTIFYREDIRECTURI,
            'grant_type':'authorization_code'})
        const authResponse = await axios.post(url, data, {
            headers: {
                'Authorization' : `Basic ${tokenParams}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return(authResponse.data)
    
    
    }catch(e){
        return e.response
    }
}

const refreshAuthToken = async (refresh_token) => {
    try{
        const url = 'https://accounts.spotify.com/api/token'
        const tokenParams = Buffer.from(`${process.env.SPOTIFYAPIID}:${process.env.SPOTIFYAPISECRET}` , 'utf-8').toString('base64')
        const data = querystring.stringify({
            'grant_type' : 'refresh_token',
            'refresh_token' : `${refresh_token}`
        })
        const refreshResponse = await axios.post(url, data, {
            headers: {
                'Authorization' : `Basic ${tokenParams}`
            }
        })
        return refreshResponse.data
    } catch (e) {
        return e.response
    }
}


module.exports = {
    getAuthToken,
    refreshAuthToken
}