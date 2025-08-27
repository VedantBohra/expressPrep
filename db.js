const storageArray = [{name: "user1", password: "Hello1" ,age: 20 , id: 10 , sports: "football" , file: [] , role: "Admin" , balance: 50},
                      {name: "user2", password: "Hello2" , age: 23 , id: 20, sports: "football", file: [], role: "User", balance: 100},
                      {name: "user3", password: "Hello2" , age: 23 , id: 30, sports: "football", file: [], role: "User", balance: 150},   
                      {name: "user4", password: "Hello2" , age: 23 , id: 40, sports: "football", file: [], role: "User", balance: 500},
                      {name: "user5", password: "Hello2" , age: 23 , id: 50, sports: "cricket", file: [], role: "Admin", balance: 100},
                      {name: "user6", password: "Hello2" , age: 23 , id: 60, sports: "cricket", file: [], role: "User", balance: 30},
                      {name: "user7", password: "Hello2" , age: 23 , id: 70, sports: "cricket", file: [], role: "User", balance: 100},
                      {name: "user8", password: "Hello2" , age: 23 , id: 80, sports: "football", file: [], role: "User", balance: 200},
                      {name: "user9", password: "Hello2" , age: 23 , id: 90, sports: "football", file: [], role: "User", balance: 40},
                      {name: "user10", password: "Hello2" , age: 23 , id: 85, sports: "football", file: [], role: "User", balance: 100}
                    ]

// mock post to show the nested relationship of post and comments 
// in db this would be 1 user -> many posts and 1 post to one user but many comments
const post = [{id: 200, userId: 10, Comments: []} , 
             {id:300 , userId: 10 , Comments: []}]

module.exports = {storageArray , post}