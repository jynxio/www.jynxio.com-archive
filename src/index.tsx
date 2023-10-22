import '@/reset.css';
import '@/global.css';
import '@/temps/fonts/process/firacode-regular-400/index.css';
import '@/temps/fonts/process/lxgwwenkai-bold-700/index.css';
import '@/temps/fonts/process/lxgwwenkai-regular-400/index.css';
import '@/temps/fonts/process/lxgwwenkaimono-regular-400/index.css';
import routes from '@/routers';
import { render } from 'solid-js/web';
import { Router, useRoutes } from '@solidjs/router';

// TODO: 重定向

const App = () => {
    const Routes = useRoutes(routes);

    return (
        <Router>
            <Routes />
        </Router>
    );
};

render(() => <App />, document.getElementById('root')!);
