import { Component, createEffect } from 'solid-js';
import styles from './App.module.css';
import { Route, Routes } from 'solid-app-router';
import { Chat, Login, Signup } from './pages';
import { store, setStore } from './store/store';

const App: Component = () => {



  createEffect(() => {
    setStore('user', () => JSON.parse(localStorage.getItem('user') as string))
    console.log(store)
  })


  return (
    <div class={styles.App}>
      <Routes>
        <Route path="/chat" component={Chat} />
        <Route path="/signup/*" component={Signup} />
        <Route path="/login" component={Login} />
      </Routes>
    </div>
  );
};

export default App;
