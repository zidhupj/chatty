/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from 'solid-app-router';
import { HopeProvider, NotificationsProvider, HopeThemeConfig } from '@hope-ui/solid';

import './index.css';
import App from './App';

render(() => (
    <Router>
        <HopeProvider>
            <NotificationsProvider placement="bottom-start">
                <App />
            </NotificationsProvider>
        </HopeProvider>
    </Router>
)
    , document.getElementById('root') as HTMLElement);
