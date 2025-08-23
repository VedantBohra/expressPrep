// Middleware which logs request method , Url , timestamp

function middleware(req , res , next){
    const APP_NAME = process.env.APP_NAME || "DefaultApp"

    // get method
    const method = req.method

    // get url
    // req.path = without domain / query  e.g -> /users/42
    // req.originalUrl = /users/42?sort=asc

    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl

    const date = new Date()
    const timestamp = date.toString()

    console.log(`APP_NAME -> ${APP_NAME} , Method -> ${method} , URL -> ${fullUrl} , timestamp -> ${timestamp}`)
    next()
}

module.exports =  middleware