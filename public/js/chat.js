const socket = io()

//Elements
const $messageForm = document.querySelector('#form')
const $messageFromInput = $messageForm.querySelector('input')
const $messageFromButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#location')
const $messages =  document.querySelector('#messages')


//Templetes
const messageTemplete =  document.querySelector('#message-templete').innerHTML
const locationTemplete = document.querySelector('#location-templete').innerHTML
const sidebarTemplete =  document.querySelector('#sidebar-templete').innerHTML

//Options
const {username , room} =  Qs.parse(location.search,{ignoreQueryPrefix : true})

//Auto Scroll
const autoScroll = () => {

    $messages.scrollTop = $messages.scrollHeight
/*
        //New Message element
        const $newMessages = $messages.lastElementChild
        
        //Height of new message
        const newMessageStyle = getComputedStyle($newMessages)
        const newMessagesMargin = parseInt(newMessageStyle.marginBottom)
        const newMessageHeight =  $newMessages.offsetHeight + newMessagesMargin
       
        //Visible Height
        const visibleHeight =  $messages.offsetHeight
      
        //Height of message conatiner
        const containerHeight = $messages.scrollHeight

        //How for have i scroll
        const scrollOffset =  $messages.scrollTop + visibleHeight
       
        if(containerHeight - newMessageHeight <= scrollOffset) {
            $messages.scrollTop = $messages.scrollHeight
        }
        */
}


//Send Message
socket.on('message' ,(message) =>{
  // console.log(message)
    const html = Mustache.render(messageTemplete,{
        username:message.username,
        message:message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})
//Send Location
socket.on('sendLocation', (message) => {
    const html = Mustache.render(locationTemplete,{
       username :message.username,
        locationurl : message.url,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
   // console.log(message)
})
//List of user in room
socket.on('roomData',({room , users}) => {
   // console.log(room)
   // console.log(users)
    const html = Mustache.render(sidebarTemplete,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML =  html
})
$messageForm.addEventListener('submit' , (e) => {
         //Disable
    $messageFromButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessge', message, (error) => {
        //Enable
    $messageFromButton.removeAttribute('disabled')
    $messageFromInput.value = ''
    $messageFromInput.focus()
        if(error) {
            console.log(error)
        }
        console.log("Message has been deliverd!",)
    })
    e.preventDefault()
})
$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geoloaction is supported by your browser')
    }
    //disable
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendLocation',{
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        },()=> {
         //enable
          $sendLocationButton.removeAttribute('disabled')
            console.log("Location has been shared")
        })
    })
})
socket.emit('join',{username, room},(error) => {
    if(error) {
        alert(error),
        location.href = '/'
    }
    
})
 
