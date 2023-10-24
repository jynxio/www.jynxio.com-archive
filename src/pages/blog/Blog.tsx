import style from './Blog.module.css';
import Nav from '@/components/blog/nav';
import Post from '@/components/blog/post';
import { lazy } from 'solid-js';

const Search = lazy(() => import('@/components/blog/search'));

function Blog() {
    return (
        <main class={style.container}>
            <section class={style.post}>
                <Post />
            </section>
            <section class={style.nav}>
                <Nav />
            </section>
            <Search />
        </main>
    );
}

export default Blog;
