import { useNavigate } from 'solid-app-router';
import { BiPlusCircle, BiSearchAlt2 } from 'solid-icons/bi';
import { Component, ComponentProps, createEffect, createSignal, onMount } from 'solid-js';
import { css, styled } from 'solid-styled-components';
import { privateRequest } from '../functions/requestMethods';
import { setStore, store } from '../store/store'
import { io, Socket } from 'socket.io-client'
import { ChatSidebar } from '../components';

const Container = styled("div")`
    width: 100vw;
    height: 100vh;
    background-color: #21292f;
    position: fixed;
    ::-webkit-scrollbar{
        width: 0.5vw;
    }
    ::-webkit-scrollbar-track{
        background-color: #708090;
        border-radius: 50px;
        margin: 5px;
    }
    ::-webkit-scrollbar-thumb{
        background-color: #576b7b;
    }
    &::before{
        content: '';
        height: 100vh;
        width: 26%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: turquoise;
        color: #fff;
    }
    .inner-box{
        position: absolute;
        inset: 30px;
        overflow: hidden;
        background: rgba(255, 255, 255,0.1);
        border-radius: 7px;
        box-shadow: 20px 20px 50px rgba(0, 0, 0,0.5);
        border-top: 2px solid rgba(255, 255, 255, 0.5);
        border-left: 2px solid rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(.5px);
        display: grid;
        grid-template-columns: 25% 75%;
        grid-template-rows: 1fr;
        grid-auto-rows: 1fr;
        .header{
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                height: 10%;
                padding: 30px;
                position: relative;
                &::before{
                    content: '';
                    position: absolute;
                    inset: 0px;
                    left: 50%;
                    transform: translate(-50%,0);
                }
            }
        .right{
            width:100%;
            height:100%;
            overflow: auto;
            .header{
                .add-contact{
                }
                .user{
                    display: grid;
                    border: 2px solid turquoise;
                    grid-template-columns: 3fr 1fr;
                    grid-template-rows: 1fr 1fr;
                    grid-auto-rows: 1fr;
                    border-radius: 100px;
                    background-color: turquoise;
                    padding-left: 30px;
                    .avatar{
                        grid-column: 2/3;
                        grid-row: 1/3;
                        height: 45px;
                        border-radius: 50%;
                        background-color: #21292f;
                        justify-self: end;
                    }
                    .user-name{
                        grid-column: 1/2;
                        padding-top: 5px;
                    }
                    .user-username{
                        grid-column: 1/2;
                    }

                }
                &::before{
                    border-bottom: 2px solid turquoise;
                    width: 90%;
                }
            }
            .main{
                height: 90%;
                .main-chat{
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: space-between;
                    background-image: url("src/assets/images/chat-background.png");
                    background-size: 200px;
                    .main-chat-header-container{
                        background-color: black;
                        display: flex;
                        .main-chat-header{
                            color: white;
                            display: grid;
                            grid-template-columns: 1fr 3fr;
                            grid-template-rows: 1fr 1fr;
                            grid-auto-rows: 1fr;
                            padding: 10px;
                            column-gap: 10px;
                            row-gap: 5px;
                            img{
                                outline: 2px solid turquoise;
                                background-color: #26847b;
                                height: 50px;
                                grid-column: 1/2;
                                grid-row: 1/3;
                                border-radius: 50%;
                            }
                            .main-chat-header-name{
                                grid-column: 2/3;
                                align-self: end;
                            }
                            .main-chat-header-uid{
                                grid-column: 2/3;
                                align-self: start;
                            }
                        }
                    }
                    .main-chat-body{
                        flex: 1;
                        overflow-x: hidden;
                        overflow-y: scroll;
                        background: transparent;
                        height: 100%;
                        max-height: 100%;
                        width: 100%;
                        color: black;
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                        padding: 5px;
                        .message{
                            width: fit-content;
                            padding: 5px;
                            border-radius: 7px 7px 7px 7px;
                            position: relative;
                            display: grid;
                            gap: 5px;
                            .message-from{
                                z-index: 2;
                                position: relative;
                                font-size: 10px;
                                font-weight: bold;
                                color: #1a0da8;
                            }
                            .message-body{z-index: 3;position: relative;}
                            .message-time{ 
                                font-size: 10px;
                                font-weight: bold;
                                color: #1a0da8;
                            }
                            &::before{
                                z-index: 1;
                                content: "";
                                position: absolute;
                                top:0;
                                width: 14px;
                                height: 50%;
                            }
                        }
                        .recieved{
                            margin-left: 7px;
                            align-self: flex-start;
                            background-color: #fcdb1a;
                            &::before{
                                box-shadow: 7px 0 0 0 #fcdb1a;
                                right: 100%;
                                border-radius: 0 14px 0 0;
                            }
                            .message-time{ text-align: right;}
                        }
                        .sent{
                            margin-right: 7px;
                            align-self: flex-end;
                            background-color: #bfc1c2;
                            &::before{
                                box-shadow: -7px 0 0 0 #bfc1c2;
                                left: 100%;
                                border-radius: 14px 0 0 0;
                            }
                            .message-from{
                                text-align: right;
                            }
                            .message-time{ text-align: left;}
                        }
                    }
                    .main-chat-interface{
                        background: transparent;
                        padding-block: 10px;
                        padding-inline: 15px;
                        display: flex;
                        gap: 20px;
                        input{
                            border: 2px solid #fcdb1a;
                            flex:1;
                            height: 40px;
                            border-radius: 50px;
                        }
                        button{
                            border-radius: 50%;
                            background-color:#fcdb1a;
                        }
                    }
                }
            }
        }
    }
`

interface ChatProps extends ComponentProps<any> {
    // add props here
}

const Chat: Component<ChatProps> = (props: ChatProps) => {
    const navigate = useNavigate();
    const [myChats, setMyChats] = createSignal<{
        id: string, users: [{ username: string, name: string, avatar: string }]
    }[]>([]);
    let messageInput: HTMLInputElement | ((el: HTMLInputElement) => void) | undefined;
    let mainChatBody: HTMLDivElement | ((el: HTMLDivElement) => void) | undefined;
    const [selectedChat, setSelectedChat] = createSignal({
        id: '',
        users: [{
            username: '',
            name: '',
            avatar: '',
        }]
    });
    let socket: Socket;
    onMount(async () => {
        socket = io("http://localhost:5000", {
            withCredentials: true,
        })
        socket.on('recieve-message', (response) => {
            console.log(response)
            console.log(response.chatId)
            if (!store.chats[response.chatId]) {
                setStore("chats", chats => ({ ...chats, [response.chatId]: { messages: [] } }))
            }
            setStore("chats", response.chatId, "messages", (messages) => [...messages, response.message])
            if (mainChatBody instanceof HTMLDivElement) {
                mainChatBody.scrollTop = mainChatBody.scrollHeight;
                console.log(mainChatBody.scrollTop, mainChatBody.scrollHeight)
            }
        })
        socket.on('message-history-response', (response) => {
            if (mainChatBody instanceof HTMLDivElement) {
                const { scrollTop, scrollHeight } = mainChatBody
                const { messageHistory, chatId } = response;
                if (!store.chats[response.chatId]) {
                    setStore("chats", chats => ({ ...chats, [response.chatId]: { messages: [] } }))
                }
                setStore('chats', chatId, "messages", (messages) => [...messageHistory, ...messages]);
                mainChatBody.scrollTop = scrollTop + (mainChatBody.scrollHeight - scrollHeight);
            }
        })
    })

    console.log(store.user.username)
    createEffect(async () => {
        console.log(store.user.username)
        setTimeout(() => {
            if (!store.user?.username) {
                navigate('/login');
            }
        }, 2000)
        if (store.user?.username) {
            const { data } = await privateRequest.get('/user/all-contacts');
            console.log(data.chats);
            setMyChats(data.chats);
            setSelectedChat(myChats()[1])
        }
    })

    const sendMessage = (e: any) => {
        e.preventDefault();
        try {
            if (messageInput instanceof HTMLInputElement) {
                socket.emit("message", { chatId: selectedChat().id, to: selectedChat().users[0].username, message: messageInput.value });
                messageInput.value = "";
            }
        } catch (error) {
            console.log("was errr here", error)
        }
    }

    createEffect(() => {
        console.log("store value");
        console.log(store.chats["dfweavdfgre"].messages);
    })

    const onChatSelection = (chat: { id: string, users: [{ username: string, name: string, avatar: string }] }) => {
        if (!store.chats[chat.id]) {
            setStore("chats", chats => ({ ...chats, [chat.id]: { scrollTop: 0, messages: [] } }))
        }
        console.log("was here", store.chats[chat.id].messages.length)
        socket.emit("message-history", { chatId: chat.id, limit: 20, offset: store.chats[chat.id].messages.length })
        setSelectedChat(chat)
        if (mainChatBody instanceof HTMLDivElement) {
            mainChatBody.scrollTop = store.chats[chat.id].scrollTop;
        }
    }

    const loadMessages = (e: Event) => {
        if (mainChatBody instanceof HTMLDivElement) {
            const { scrollTop } = mainChatBody;
            setStore("chats", selectedChat().id, "scrollTop", scrollTop)
            if (scrollTop === 0) {
                console.log("Screoll was her")
                socket.emit("message-history", { chatId: selectedChat().id, limit: 20, offset: store.chats[selectedChat().id].messages.length })
            }
        }
    }

    const getNextMessages = () => {
        socket.emit("message-history", { chatId: selectedChat().id, limit: 20, offset: store.chats[selectedChat().id].messages.length })
    }

    return (
        <Container>
            <div class="inner-box">
                <ChatSidebar
                    myChats={myChats}
                    setSelectedChat={setSelectedChat}
                    onChatSelection={onChatSelection}
                />
                <div class="right">
                    <div class="header">
                        <div class="add-contact" onClick={getNextMessages}>
                            <BiPlusCircle></BiPlusCircle>
                        </div>
                        {() => {
                            const svg: string = store.user.avatar;
                            const blob = new Blob([svg], { type: 'image/svg+xml' });
                            const url = URL.createObjectURL(blob);
                            const avatar = document.createElement('img');
                            avatar.src = url;
                            avatar.classList.add("avatar")
                            return (
                                <div class="user">
                                    <div class="user-name">{store.user.name}</div>
                                    {avatar}
                                    <div class="user-username">@{store.user.username}</div>
                                </div>
                            );
                        }}
                    </div>
                    <div class="main">
                        {selectedChat().users[0].username ?
                            (<div class="main-chat">
                                <div class="main-chat-header-container">
                                    {() => {
                                        const svg: string = selectedChat().users[0].avatar;
                                        const blob = new Blob([svg], { type: 'image/svg+xml' });
                                        const url = URL.createObjectURL(blob);
                                        const avatar = document.createElement('img');
                                        avatar.src = url;
                                        return (
                                            <div class="main-chat-header">
                                                <div class="main-chat-header-name">{selectedChat().users[0].name}</div>
                                                <div class="main-chat-header-uid">@{selectedChat().users[0].username}</div>
                                                {avatar}
                                            </div>
                                        );
                                    }}
                                </div>
                                <div class="main-chat-body" ref={mainChatBody} onScroll={loadMessages}>
                                    {store.chats[selectedChat().id]?.messages?.map((message) => (
                                        <div class={`message ${message.fromId === store.user.username ? "sent" : "recieved"}`}>
                                            <div class="message-from">
                                                {message.fromId === store.user.username ? store.user.name :
                                                    myChats().find(chat => chat.id == selectedChat().id)?.users.find(({ username }) => username == message.fromId)?.name}
                                            </div>
                                            <div class="message-body">
                                                {message.message}
                                            </div>
                                            <div class="message-time">
                                                {() => {
                                                    const date = new Date(message.createdAt)
                                                    return `${date.getHours()}:${date.getMinutes()}`
                                                }}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form class="main-chat-interface" onSubmit={sendMessage}>
                                    <input type="text" name="" id="" ref={messageInput} />
                                    <button type="submit">Send</button>
                                </form>
                            </div>) :
                            (<div class="main-home">
                                <div class="main-home-title">Welcome {store.user.name}!</div>
                                <div class="main-home-sub">Add or select a contact to start a conversation</div>
                            </div>)
                        }
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Chat;