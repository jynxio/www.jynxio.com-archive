import '@/reset.css';
import '@/global.css';
import Post from '@/pages/Post';
import { render } from 'solid-js/web';
import { Route, Router, Routes } from '@solidjs/router';

const root = document.getElementById('root');
const code = () => (
    <Router>
        <Routes>
            <Route path="/*path" component={Post} />
        </Routes>
    </Router>
);

render(code, root!);
