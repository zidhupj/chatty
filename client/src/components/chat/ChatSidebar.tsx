import { BiSearchAlt2 } from "solid-icons/bi";
import { Accessor, Component, ComponentProps, Setter } from "solid-js";
import { styled } from "solid-styled-components";

interface ChatSidebarProps extends ComponentProps<any> {
    myChats: Accessor<{
        id: string;
        users: [{
            username: string;
            name: string;
            avatar: string;
        }];
    }[]>,
    setSelectedChat: Setter<{}>
    onChatSelection: (chat: { id: string; users: [{ username: string; name: string; avatar: string; }]; }) => void
}

export const ChatSidebar: Component<ChatSidebarProps> = (props) => {
    const { myChats, onChatSelection } = props;


    return (
        <Container>
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
                                <div class="section-list-item" onClick={() => onChatSelection(chat)}>
                                    {avatar}
                                    <div class="section-list-item-name">{chat.users[0].name}</div>
                                    <div class="section-list-item-uid">@{chat.users[0].username}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Container>
    )
}

const Container = styled('div')`
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
`