function globalErrorMiddleware(err , req , res, next){
    console.error(err.stack)
    const statusCode = err.statusCode || 500
    const errorMessage = err.errorMessage || "Something went wrong!"
    
    res.status(statusCode).json({
        msg: errorMessage
    })
}

module.exports = globalErrorMiddleware