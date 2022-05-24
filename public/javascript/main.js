const socket = io();

const joinForm = document.querySelector("#join-screen")
const joinInput = document.querySelector("#join-input");
const joinScreen = document.querySelector("#join-screen");
const chatContainer = document.querySelector("#chat-container")
const exitBtn = document.querySelector("#btn-exit");
const welcome = document.querySelector("#welcome");
const listRoom = document.querySelector("#list-room")
const chatForm = document.querySelector('#chat-form');
const chatMes = document.querySelector('#chat-mes');
const chatbox = document.querySelector('#message')
const badge = document.querySelector("#badge");
const errorLogger = document.querySelector("#error");


let username = "";
joinForm.addEventListener("submit", (e) =>{
    username = joinInput.value;
    e.preventDefault();
    if(username == ""){
        errorLogger.textContent = "Không được để trống tên đăng nhập!";
        errorLogger.style.display = "block";
    }else if(username.length < 3){
        errorLogger.textContent = "Tên đăng nhập phải dài hơn 3 ký tự";
        errorLogger.style.display = "block";
    }else if(username.length > 100){
        errorLogger.textContent = "Tên đăng nhập phải ngắn hơn 100 ký tự";
        errorLogger.style.display = "block";
    }else{
        
        joinScreen.style.display = "none";
        chatContainer.style.display = "flex";
        exitBtn.style.display = "inline";
        welcome.innerHTML = `Welcome to the conversation, <b>${username}</b>.`
        socket.emit('newuser', {username: username });
    }

})




chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatMes.value
    if(message != ""){
        appendMess(message,'me', 'me');
        socket.emit('on-chat', { message: message, username: username });
        chatMes.value = ''
    }
})

function appendMess(message, sender, status){
    const chatItem = document.createElement('li')
    chatItem.setAttribute("class", "chat-item")

    chatItem.innerHTML = `<div class="sender">${sender}</div>
    <div class="content content-${status}">${message}</div>`;
    chatItem.setAttribute("class", "chat-item " + status)

    chatbox.appendChild(chatItem)
}


socket.on('on-chat', (data) => {
    appendMess(data.message, data.username, 'other')
})

socket.on('update-join', (data) =>{
    userJoin(data.username, "joined");

})

// xu ly socket khi nguoi dung thoat khoi phong tro chuyen
exitBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    joinScreen.style.display = "flex";
    chatContainer.style.display = "none";
    socket.emit('exituser', {username: username });
    exitBtn.style.display = "none"
    errorLogger.style.display = "none"
})

socket.on('update-exit', (data) =>{
    userJoin(data.username, "left");
})

function userJoin(username, status){
    const newUserItem = document.createElement('li')
    newUserItem.setAttribute("class", "new-user")
    newUserItem.innerHTML = `<p class="">${username} ${status} the conversation</p>`
    
    chatbox.appendChild(newUserItem)
}

socket.on("user-list", (users) =>{
    user_arr = Object.values(users);
    listRoom.innerHTML = ""
    user_arr.map((user) =>{
        const roomListItem = document.createElement('li')
        roomListItem.setAttribute("class", "list-room-item py-3 d-flex justify-content-between align-items-center")
        roomListItem.innerHTML = `<h5 class="room-name">${user}</h5>`
        
        listRoom.appendChild(roomListItem)
    })
    badge.textContent = user_arr.length;
})

