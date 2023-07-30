import style from './Blog.module.css';
import Nav from '@/components/blog/Nav';
import Post from '@/components/blog/Post';
import { lazy } from 'solid-js';

const LazySearch = lazy(() => import('@/components/blog/Search'));

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
