const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // window time period to consider for rate limiting
    limit: 5, // limit 5 request per minute for every window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,
    ipv6Subnet: 64
})

module.exports = limiter