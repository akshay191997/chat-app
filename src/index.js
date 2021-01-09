const express =  require("express")
const http =  require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const app = express()
const server =  http.createServer(app)
const io = socketio(server)
const {generateMessage,generateLocationMessages} = require('./utlis/messages')
const {adduser,removeuser,getUser,getUserInRoom} = require('./utlis/users')
const PORT =  process.env.PORT || 3000
const publicPath = path.join(__dirname,'../public')
app.use(express.static(publicPath))

io.on ('connection',(socket) =>{
    console.log("New WebSocket Connection")
    
    socket.on('join',(options,callback) => {
        const {error, user} = adduser( {id: socket.id, ...options})
        if(error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generateMessage("Admin",'Welcome!!'))
        socket.broadcast.to(user.room).emit('message',generateMessage( 'Admin' ,`${user.username} has joined`))
        io.to(user.room).emit('roomData' ,{
            room :user.room,
            users : getUserInRoom(user.room)
        })
        callback()
    })
    socket.on('sendMessge',(message , callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
       if(filter.isProfane(message)) {
           return callback('Profinity is not allowed')
       }

        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback("Delivered!")
    })
    socket.on('sendLocation',(location , callback) =>{
        const user =  getUser(socket.id)
        io.to(user.room).emit('sendLocation',generateLocationMessages(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
        
    })
    socket.on('disconnect', () => {
        const  user = removeuser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage('Admin' ,`${user.username} has Left`))
            io.to(user.room).emit('roomData' ,{
                room :user.room,
                users : getUserInRoom(user.room)
            })
        }
        
    })

})
server.listen(PORT,() =>{
    console.log("Server Up and Running!!" + PORT)
})