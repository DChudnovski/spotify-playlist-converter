const SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFYAPIID,
  clientSecret: process.env.SPOTIFYAPISECRET,
})



const getPlaylistInfo = async () => {
  const getCredentials = await spotifyApi.clientCredentialsGrant()
  const setAccessToken = await spotifyApi.setAccessToken(getCredentials.body['access_token'])
  const playlistInfo = await spotifyApi.getUserPlaylists('31r7og6t6kofno7q2abrlkhsaqzy')
  const playlistId = playlistInfo.body.items[0].id
  const playlistTracks = await spotifyApi.getPlaylistTracks(playlistId)
  const tracks = playlistTracks.body.items
  const trackInfo = await tracks.map((info) => {
    return info.track.artists[0].name + ' ' + info.track.name
  })
  return trackInfo
}





module.exports = getPlaylistInfo