import { lazy } from 'solid-js';

const LazyLoader = lazy(() => import('@/components/blog/Loader'));

function Post() {
    return (
        <div>
            <LazyLoader />
        </div>
    );
}

export default Post;
