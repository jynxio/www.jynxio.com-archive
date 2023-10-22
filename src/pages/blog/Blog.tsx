import style from './Blog.module.css';
import Nav from '@/components/blog/nav';
import Post from '@/components/blog/post';
import { lazy } from 'solid-js';

const LazySearch = lazy(() => import('@/components/blog/search'));

function Blog() {
    return (
        <main class={style.container}>
            <section class={style.nav}>
                <Nav />
            </section>
            <section class={style.post}>
                <Post />
            </section>
            <LazySearch />
        </main>
    );
}

export default Blog;
