// Role Based Access Control Checks Middleware
const storageArray = require('./db')

function authorization(req , res , next){
    const userId = req.userId

    const index = storageArray.findIndex(user => user.id == userId)
    const user = storageArray[index]

    if(user.role != "Admin"){
        return res.status(403).json({msg: "Forbidden access: Only Admins can have the access"})
    }

    next()
}

module.exports = authorization