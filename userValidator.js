const z = require('zod')

const userValidator = z.object({
    name: z.string().min(3),
    password: z.string().min(5),
    age: z.number().min(18).max(99),
    sports: z.string().max(20)
})

module.exports = userValidator