const users = []
//We have to here is adduser removeuser getuser getuserInRoom

//add user
const adduser = ({id, username,room}) => {
    //clean user data 
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    //valdate the data
    if(!username || !room){
        return {
            error : "Username and room are required"
        }
    }
    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    //validate user
    if(existingUser) {
        return {
            error : "Username is in use"
        }
    }
    //store user
    const user = {id, username,room}
    users.push(user)
    return {user}
}

//Remove user.
const removeuser  = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index !== -1) {
        return users.splice(index , 1)[0]
    }
}
//Get user
const getUser = (id) => {
    const userid = users.find((user) => user.id == id )
    return userid
}
const getUserInRoom = (room)=> {
    room.trim().toLowerCase()
    const userroom = users.filter((user) => user.room == room)
    return userroom
}
module.exports = {
    adduser,
    removeuser,
    getUser,
    getUserInRoom
}

