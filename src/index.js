const express = require('express')
require('./db/mongoose')
const playlistsRouter = require('./routers/playlists')
const userRouter = require('./routers/user')
const authRouter = require('./routers/authorization')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(playlistsRouter)
app.use(userRouter)
app.use(authRouter)

app.listen(port, () => {
    console.log('Server is up on port' + ' ' + port)
})
