const auth = async (req, res, next) => {
    try{
        const access_token = req.header('Authorization').replace('Bearer ', '')
        req.access_token = access_token
    } catch (e) {
        res.status(401).send( { error: 'Please authenticate'})
    }
}