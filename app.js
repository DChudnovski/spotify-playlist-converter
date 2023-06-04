const getPlaylistInfo = require('./utils/spotify-playlist-handler')


getPlaylistInfo().then((result) => {
    console.log(result)
  })