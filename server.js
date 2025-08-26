const express = require('express')
const middleware = require('./middleware')
const globalErrorMiddleware = require('./globalErrorMiddleware')
const authMiddleware = require('./authMiddleware')
const jwt = require('jsonwebtoken')
const userValidator = require('./userValidator') // zod 
const limiter = require('./rateLimiterMiddleware') 
const multer = require('multer') // file storage through form data

require("dotenv").config()

const app = express() // create instance of express app

app.use(express.json()) // parse json request bodies
app.use(middleware)
app.use(limiter)

const PORT = process.env.PORT || 5000
const secretKey = process.env.JWT_SECRET

// multer disk storage
const storage = multer.diskStorage({
    destination: function(req , file , cb){
        cb(null , './uploads')
    },

    filename: function(req, file , cb){
        cb(null , `${Date.now().toLocaleString()}-${file.originalname}`)
    }
})

// initializing multer object
const upload = multer({ storage })

const storageArray = [{name: "user1", password: "Hello1" ,age: 20 , id: 10 , sports: "football" , file: []},
                      {name: "user2", password: "Hello2" , age: 23 , id: 20, sports: "football", file: []},
                      {name: "user3", password: "Hello2" , age: 23 , id: 30, sports: "football", file: []},   
                      {name: "user4", password: "Hello2" , age: 23 , id: 40, sports: "football", file: []},
                      {name: "user5", password: "Hello2" , age: 23 , id: 50, sports: "cricket", file: []},
                      {name: "user6", password: "Hello2" , age: 23 , id: 60, sports: "cricket", file: []},
                      {name: "user7", password: "Hello2" , age: 23 , id: 70, sports: "cricket", file: []},
                      {name: "user8", password: "Hello2" , age: 23 , id: 80, sports: "football", file: []},
                      {name: "user9", password: "Hello2" , age: 23 , id: 90, sports: "football", file: []},
                      {name: "user10", password: "Hello2" , age: 23 , id: 85, sports: "football", file: []}
                    ]

// get profile pic
app.get('/profile-pic', authMiddleware ,(req , res) => {
    const userId = req.userId

    const index = storageArray.findIndex(user => user.id == userId)
    if(storageArray[index].file.length === 0){
        return res.status(404).json({msg: "Profile Pic not uploaded try again"})
    }

    const filePath = storageArray[index].file[0].path

    return res.status(200).sendFile(filePath , {root: "."})
})

// post a profile pic and get the details of image as a response
app.post('/profile-pic', authMiddleware , upload.single('profilePic'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    
    const userId = req.userId

    const index = storageArray.findIndex(user => userId == user.id)
    storageArray[index].file.push({fileName: req.file.originalname , path: req.file.path , size: req.file.size})

    return res.status(200).json({msg: req.file})
})

app.get('/users' , (req , res) => {
    if(Object.keys(req.query).length !== 0){
        if(Object.prototype.hasOwnProperty.call(req.query, "age")){
            const { age } = req.query
            const filteredAgeUser = storageArray.filter(user => user.age === parseInt(age))
            return res.status(200).json({"Filtered Age Users" : filteredAgeUser})
        }

        if(Object.prototype.hasOwnProperty.call(req.query, "sort")){
            let sortedUsers = [...storageArray]

            const { sort } = req.query
            
            // .sort() interesting method
            if(sort == "asc"){
                sortedUsers.sort((a , b) => a.name.localeCompare(b.name))    
            } else if(sort == "desc"){
                sortedUsers.sort((a , b) => b.name.localeCompare(a.name))    
            }

            return res.status(200).json({"sortedUsers" : sortedUsers})
        }

        // pagination with page no. , limit and the search query
        const {search , page , limit} = req.query

        if(search){
            const filteredArraySearch = storageArray.filter(user => user.sports == search)
            if(filteredArraySearch.length === 0){
                return res.status(404).json({msg: "Search query value does not match"})
            }
            
            const intLimit = parseInt(limit)
            const intPage = parseInt(page)
            const totalPages = Math.ceil(filteredArraySearch.length / intLimit)

            if(intPage > totalPages){
                return res.status(404).json({msg: "There is no pages left for this search query"})
            } else if(intPage == totalPages){
                const pageFirstIndex = (intPage - 1) * intLimit
                const resultPage = []
                for(let i = pageFirstIndex; i < filteredArraySearch.length; i++){
                    resultPage.push(filteredArraySearch[i])
                }

                return res.status(200).json({Page: resultPage})
            } else if(intPage < totalPages && intPage > 0){
                const pageFirstIndex = (intPage - 1) * intLimit
                const pageLastIndex = intPage * intLimit

                const resultPage = []
                for(let i = pageFirstIndex; i < pageLastIndex; i++){
                    resultPage.push(filteredArraySearch[i])
                }
                
                return res.status(200).json({Page: resultPage})
            }
        }
    }

    if(storageArray.length === 0){
        return res.status(400).json({
            msg: "No users data found"
        })
    }

    return res.status(200).json({users: storageArray})
}) 

// authMiddleware test
app.get('/profile' , authMiddleware , (req ,res) => {
    const userId = req.userId
    const index = storageArray.findIndex(user => user.id === userId)
    if(index == -1) return res.status(403).json({msg: "UserId does not match"})
    return res.status(200).json({msg : "you can access the profile" , username: storageArray[index].name})
})

app.post('/login' , (req , res) => {
    const loggedUser = req.body
    
    const findUserIndex = storageArray.findIndex(user => loggedUser.name === user.name)
    if(findUserIndex === -1) return res.status(404).json({msg: "Username does not exist"})

    const user = storageArray[findUserIndex]

    if(user.password !== loggedUser.password){
        return res.status(403).json({msg: "Wrong password"})
    }

    const payload = {
        name: user.name,
        id: user.id
    }

    try{
        const token = jwt.sign(payload , secretKey)

        return res.status(200).json({msg: "Token generated Successfully" , token: token})
    } 
    catch(err){
        return res.status(500).json({msg: "Server error : Error generating token"})
    }
 
})

app.post('/users' , (req , res) => {
    const user = req.body // new user object with name and age
    if(!user) return res.status(400).json({msg: "No user data is given"})
    
    // zod verification with safeParse()
    const result = userValidator.safeParse(user)
    if(!result.success) return res.status(403).json({msg: "Invalid user credentials format" , err: result.error})
    const index = storageArray.findIndex(existingUser => existingUser.name == user.name)
    if(index != -1) return res.status(403).json({msg: "User already exists"})

    const userId = Math.floor(Math.random() * 100 + 1)
    user.id = userId
    storageArray.push(user)

    return res.status(200).json({
        msg: "user created successfully"
    })
})

// update user details logic
app.put('/users/:id' , (req, res) => {
    const updateId = parseInt(req.params.id)
    const updatedUser = req.body

    if(!updateId) return res.status(400).json({msg: "No userId received"})
    if(!updatedUser) return res.status(400).json({msg: "No user data received"})
    
    const index = storageArray.findIndex(user => user.id === updateId)
    if(index === -1) return res.status(404).json({msg: "User not found"})

    storageArray[index] = {...storageArray[index] , ...updatedUser}

    return res.status(200).json({msg: "User updated successfully"})
})

app.delete('/users/:id' , (req , res) => {
    const deleteId = parseInt(req.params.id)
    if(!deleteId) return res.status(400).json({msg: "No userId received to delete"})

    const index = storageArray.findIndex(user => user.id === deleteId)
    if(index === -1) return res.status(404).json({msg: "User not found"})

    storageArray.splice(index , 1)

    return res.status(200).json({
        msg: "Successfully deleted user"
    })
})

// Centralised catch all error handler last line of defence
app.use(globalErrorMiddleware)

app.listen(PORT , () => {
    console.log("Listening on 3000")
})


