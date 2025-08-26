const jwt = require('jsonwebtoken')

function authMiddleware(req , res , next){
    const secretKey = process.env.JWT_SECRET
    const headersAuthorization = req.headers.authorization
    if(!headersAuthorization || !headersAuthorization.startsWith('Bearer ')) return res.status(403).json({msg: "Invalid token"})
    
    const token = headersAuthorization.split(' ')[1]
    
    try{
        const decoded = jwt.verify(token , secretKey)
        req.userId = decoded.id
        next()
    }   
    catch(err){
        console.log(err.name , err.message)
        return res.status(403).json({msg: "Verification of token failed"})
    }
}

module.exports = authMiddleware