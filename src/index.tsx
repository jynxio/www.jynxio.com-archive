import '@/reset.css';
import '@/global.css';
import '@/temps/fonts/process/firacode-regular-400/index.css';
import '@/temps/fonts/process/lxgwwenkai-bold-700/index.css';
import '@/temps/fonts/process/lxgwwenkai-regular-400/index.css';
import '@/temps/fonts/process/lxgwwenkaimono-regular-400/index.css';
import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import { lazy } from 'solid-js';

const Home = lazy(() => import('@/pages/home'));
const Blog = lazy(() => import('@/pages/blog'));

const App = () => (
	<Router>
		<Route path="/" component={Home} />
		<Route path="/home" component={Home} />
		<Route path="/blog/*path" component={Blog} />
	</Router>
);

render(() => <App />, document.getElementById('root')!);
