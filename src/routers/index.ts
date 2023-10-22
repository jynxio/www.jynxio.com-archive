import { lazy } from 'solid-js';

const routes = [
    {
        path: '/',
        component: lazy(() => import('@/pages/home')),
    },
    {
        path: '/home',
        name: 'home',
        component: lazy(() => import('@/pages/home')),
    },
    {
        path: '/blog/*path',
        component: lazy(() => import('@/pages/blog')),
    },
];

export default routes;
