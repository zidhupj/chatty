import { useNavigate } from 'solid-app-router';
import { BiPlusCircle, BiSearchAlt2 } from 'solid-icons/bi';
import { Component, ComponentProps, createEffect, createSignal, onMount } from 'solid-js';
import { css, styled } from 'solid-styled-components';
import { privateRequest } from '../functions/requestMethods';
import { store } from '../store/store'
import { io, Socket } from 'socket.io-client'

const Container = styled("div")`
    width: 100vw;
    height: 100vh;
    background-color: #21292f;
    position: relative;
    &::before{
        content: '';
        height: 100vh;
        width: 800px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: turquoise;
        color: #fff;
        transform: translate(-50%,0);
    }
    .inner-box{
        position: absolute;
        inset: 30px;
        background: rgba(255, 255, 255,0.1);
        border-radius: 7px;
        box-shadow: 20px 20px 50px rgba(0, 0, 0,0.5);
        border-top: 2px solid rgba(255, 255, 255, 0.5);
        border-left: 2px solid rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(.5px);
        display: grid;
        grid-template-columns: 25% 75%;
        .header{
                display: grid;
                grid-template-columns: 20% 80%;
                height: 70px;
                place-items: center;
                padding-right: 10px;
                position: relative;
                &::before{
                    content: '';
                    position: absolute;
                    inset: 0px;
                    left: 50%;
                    transform: translate(-50%,0);
                }
            }
        .left{
            width:100%;
            height:100%;
            .header{
                &::before{
                    border-bottom: 2px solid rgba(0,0,0,0.3);
                    width: 80%;
                }
                .logo{
                    height: 50px;
                    svg{
                        height: 100%;
                    }
                }
                .search-container{
                    width: 95%;
                    .search{
                        position: relative;
                        height: 40px;
                        overflow: hidden;
                        border-radius: 7px;
                        border: 1px solid white;
                        input{
                            height:100%;
                            width:100%;
                            border: none;
                        }
                        .search-icon{
                            position: absolute;
                            width:15%;
                            height:90%;
                            justify-content: center;
                            top: 50%;
                            transform: translate(0,-50%);
                            right: 0;
                            background-color: #7e7e7e;
                            border-radius: 7px;
                        }
                    }
                }
            }
            .main{
                width: 100%;
                height: fit-content;
                .section{
                    .section-name{
                        padding: 10px;
                    }
                    .section-list{
                        display: grid;
                        grid-template-columns: 1fr;
                        padding-inline: 10px;
                        .section-list-item{
                            padding-block: 5px;
                            display: grid;
                            grid-template-columns: 1fr 8fr;
                            grid-auto-rows: 1fr;
                            column-gap: 10px; 
                            align-items: center;
                            padding-left: 20px;
                            border-bottom: 2px solid rgba(0,0,0,0.1);
                            &:hover{
                                background-color: rgba(0,0,0,0.1);
                            }
                            img{
                                height: 90%;
                                grid-row: span 3;
                            }
                            .section-list-item-name{
                                grid-row: 2;
                                grid-column: 2;
                            }
                            .section-list-item-uid{
                                grid-row-start: 3;
                                grid-column: 2;
                            }
                        }
                    }
                }
            }
        }
        .right{
            width:100%;
            height:100%;
            .header{
                img{
                    height:50px;
                }
                &::before{
                    border-bottom: 2px solid turquoise;
                    width: 90%;
                }
            }
            .main-chat-header{
                img{height: 50px;}
            }
            .main-chat-body{min-height: 300px;
            background: rgba(0,0,0,0.5);}
        }
    }
`

interface ChatProps extends ComponentProps<any> {
    // add props here
}

const Chat: Component<ChatProps> = (props: ChatProps) => {
    const navigate = useNavigate();
    const [myChats, setMyChats] = createSignal([]);
    let messageInput: HTMLInputElement | ((el: HTMLInputElement) => void) | undefined;
    const [selectedChat, setSelectedChat] = createSignal({
        id: '',
        users: [{
            username: '',
            name: '',
            avatar: '',
        }]
    });
    let socket: Socket;
    onMount(() => {
        socket = io("http://localhost:5000", {
            withCredentials: true,
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
        }
    })

    const sendMessage = () => {
        try {
            if (messageInput instanceof HTMLInputElement) {
                socket.emit("message", { chatId: selectedChat().id, to: selectedChat().users[0].username, message: messageInput.value });
            }
        } catch (error) {
            console.log("was errr here", error)
        }
    }

    return (
        <Container>
            <div class="inner-box">
                <div class="left">
                    <div class="header">
                        <div class="logo">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                            </svg>
                        </div>
                        <div class="search-container">
                            <div class="search">
                                <input type="text" name="" id="" />
                                <BiSearchAlt2 class="search-icon" />
                            </div>
                        </div>
                    </div>
                    <div class="main">
                        <div class="section">
                            <div class="section-name">Contacts</div>
                            <div class="section-list">
                                {myChats().map((chat: { id: string, users: [{ username: string, name: string, avatar: string }] }) => {
                                    const svg: string = chat.users[0].avatar;
                                    const blob = new Blob([svg], { type: 'image/svg+xml' });
                                    const url = URL.createObjectURL(blob);
                                    const avatar = document.createElement('img');
                                    avatar.src = url;
                                    return (
                                        <div class="section-list-item" onClick={() => setSelectedChat(chat)}>
                                            {avatar}
                                            <div class="section-list-item-name">{chat.users[0].name}</div>
                                            <div class="section-list-item-uid">@{chat.users[0].username}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="header">
                        <div class="add-contact">
                            <BiPlusCircle></BiPlusCircle>
                        </div>
                        {() => {
                            const svg: string = store.user.avatar;
                            const blob = new Blob([svg], { type: 'image/svg+xml' });
                            const url = URL.createObjectURL(blob);
                            const avatar = document.createElement('img');
                            avatar.src = url;
                            return (
                                <div class="user">
                                    <div class="user-name">{store.user.name}</div>
                                    <div class="user-username">{store.user.username}</div>
                                    {avatar}
                                </div>
                            );
                        }}
                    </div>
                    <div class="main">
                        {selectedChat().users[0].username ?
                            (<div class="main-chat">
                                {() => {
                                    const svg: string = selectedChat().users[0].avatar;
                                    const blob = new Blob([svg], { type: 'image/svg+xml' });
                                    const url = URL.createObjectURL(blob);
                                    const avatar = document.createElement('img');
                                    avatar.src = url;
                                    return (
                                        <div class="main-chat-header">
                                            <div class="main-chat-header-name">{selectedChat().users[0].name}</div>
                                            <div class="main-chat-header-uid">{selectedChat().users[0].username}</div>
                                            {avatar}
                                        </div>
                                    );
                                }}
                                <div class="main-chat-body"></div>
                                <div class="main-chat-interface">
                                    <input type="text" name="" id="" ref={messageInput} />
                                    <button onClick={sendMessage}>Send</button>
                                </div>
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