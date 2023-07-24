import '@/reset.css';
import '@/global.css';
import '@/temps/fonts/lxgwwenkai-regular-400/lxgwwenkai-regular-400.css';
import '@/temps/fonts/lxgwwenkai-bold-700/lxgwwenkai-bold-700.css';
import '@/temps/fonts/lxgwwenkaimono-regular-400/lxgwwenkaimono-regular-400.css';
import '@/temps/fonts/firacode-regular-400/firacode-regular-400.css';
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
