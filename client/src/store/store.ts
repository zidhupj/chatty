import { createStore } from 'solid-js/store';

const [store, setStore] = createStore({
    user: {
        name: '',
        username: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        avatar: '',
    }
})

export { store, setStore }