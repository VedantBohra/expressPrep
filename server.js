const express = require('express')
const middleware = require('./middleware')
const globalErrorMiddleware = require('./globalErrorMiddleware')
require("dotenv").config()

const app = express() // create instance of express app

app.use(express.json()) // parse json request bodies
app.use(middleware)

const PORT = process.env.PORT || 5000

const storageArray = [{name: "user1" , age: 20 , id: 30} , {name: "user2" , age: 23 , id: 50}]

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
    }

    if(storageArray.length === 0){
        return res.status(400).json({
            msg: "No users data found"
        })
    }

    return res.status(200).json({
        users: storageArray
    })
}) 

app.post('/users' , (req , res) => {
    const user = req.body // new user object with name and age

    if(!user) return res.status(400).json({msg: "No user data is given"})
    const userId = Math.floor(Math.random() * 100 + 1)
    user.id = userId
    storageArray.push(user)

    return res.status(200).json({
        msg: "user created successfully"
    })
})

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


