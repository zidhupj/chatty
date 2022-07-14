import { Component, createEffect } from 'solid-js';
import styles from './App.module.css';
import { Route, Routes } from 'solid-app-router';
import { Chat, Login, Signup } from './pages';
import { store, setStore } from './store/store';
import toast, { Toaster } from 'solid-toast';
import { styled, css } from 'solid-styled-components';

const notify = () => toast('Here is your toast.');

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
