const multer = require('multer')

function globalErrorMiddleware(err , req , res, next){
    console.error(err.stack)
    
    if(err instanceof multer.MulterError){
        return res.status(400).json({err: err.message})
    }

    const statusCode = err.statusCode || 500
    const errorMessage = err.errorMessage || "Something went wrong!"
    
    res.status(statusCode).json({
        msg: errorMessage
    })
}

module.exports = globalErrorMiddleware