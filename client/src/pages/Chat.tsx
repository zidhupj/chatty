import { Component, ComponentProps } from 'solid-js';
import { store } from '../store/store'

interface ChatProps extends ComponentProps<any> {
    // add props here
}

const Chat: Component<ChatProps> = (props: ChatProps) => {
    return (
        <div>hELLO {JSON.stringify(store.user)}
        </div>
    )
}

export default Chat;