import { lazy } from 'solid-js';

const Home = lazy(() => import('@/pages/home'));
const Blog = lazy(() => import('@/pages/blog'));

const routes = [
	{
		path: '/',
		component: Home,
	},
	{
		path: '/home',
		name: 'home',
		component: Home,
	},
	{
		path: '/blog/*path',
		component: Blog,
	},
];

export default routes;
