import { createStore } from 'solid-js/store';

const [store, setStore] = createStore<{
    user: {
        name: string,
        username: string,
        dateOfBirth: string,
        phone: string,
        email: string,
        avatar: string,
    }, chats: {
        [chatId: string]: {
            scrollTop: number,
            messages: {
                createdAt: string,
                fromId: string,
                message: string,
                toId: string
            }[]
        }
    }
}>({
    user: {
        name: '',
        username: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        avatar: '',
    },
    chats: {
        "dfweavdfgre": {
            scrollTop: 0,
            messages: [
                {
                    createdAt: "2022-07-15T13:46:45.623Z",
                    fromId: "effa",
                    message: "hih ehello",
                    toId: "ttttt"
                }
            ]
        }
    }
})

export { store, setStore }