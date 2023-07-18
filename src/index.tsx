import '@/reset.css';
import '@/global.css';
import Blog from '@/pages/Blog';
import { render } from 'solid-js/web';
import { Route, Router, Routes } from '@solidjs/router';

const root = document.getElementById('root');
const code = () => (
    <Router>
        <Routes>
            <Route path="/*path" component={Blog} />
        </Routes>
    </Router>
);

render(code, root!);
