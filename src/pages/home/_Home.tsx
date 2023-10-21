import Wave from './Wave';
import Font from './Font';
import { WebGLRenderer } from 'three';
import { OrthographicCamera } from 'three';
import { Scene } from 'three';
import { Clock } from 'three';

/* Base */
/* ----------------------------------------------------------------------------------------------- */
const size = { x: globalThis.innerWidth, y: globalThis.innerHeight };
const canvas = document.createElement('canvas');
const renderer = new WebGLRenderer({ canvas, antialias: true });

renderer.setSize(size.x, size.y);
renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));

const scene = new Scene();
const camera = new OrthographicCamera(-size.x / 2, size.x / 2, size.y / 2, -size.y / 2, 0.1, 10);

/* Wave */
/* ----------------------------------------------------------------------------------------------- */
const wave = new Wave(size.x, size.y);

wave.setPosition(0, 0, -2);
scene.add(wave.getEntity());

/* Font */
/* ----------------------------------------------------------------------------------------------- */
const font_name = new Font({
    message: 'JYN\nXIO',
    height: Math.max(size.x, size.y) * 0.1,
    space: Math.max(size.x, size.y) * 0.1 * 0.1,
    thickness: 1.5,
    type: 'outline',
    position: [0, 0, -1],
});

scene.add(font_name.getEntity());

const font_option = {
    height: size.y * 0.0135,
    space: size.y * 0.0135 * 0.1,
    type: 'fillline',
};
const font_ideas = new Font({
    message: 'IDEAS',
    height: font_option.height,
    space: font_option.space,
    type: font_option.type,
    position: [0, -size.y / 2 + size.y * 0.12 + 0, -1],
});
const font_posts = new Font({
    message: 'POSTS',
    height: font_option.height,
    space: font_option.space,
    type: font_option.type,
    position: [0, -size.y / 2 + size.y * 0.12 - font_option.height * 2, -1],
});
const font_github = new Font({
    message: 'GITHUB',
    height: font_option.height,
    space: font_option.space,
    type: font_option.type,
    position: [0, -size.y / 2 + size.y * 0.12 - font_option.height * 4, -1],
});

scene.add(font_github.getEntity(), font_ideas.getEntity(), font_posts.getEntity());
document.body.append(font_github.getDom(), font_ideas.getDom(), font_posts.getDom());
font_github.getDom().addEventListener('click', _ => (globalThis.location.href = 'https://github.com/jynxio'));
font_posts.getDom().addEventListener('click', _ => (globalThis.location.href += 'catalogue.html'));

/* Animate */
/* ----------------------------------------------------------------------------------------------- */
const clock = new Clock();

renderer.setAnimationLoop(_ => {
    const elapsed_time = clock.getElapsedTime();

    wave.setTime(elapsed_time);
    renderer.render(scene, camera);
});

/* Resize */
/* ----------------------------------------------------------------------------------------------- */
globalThis.addEventListener('resize', _ => {
    size.x = globalThis.innerWidth;
    size.y = globalThis.innerHeight;

    renderer.setSize(size.x, size.y);
    renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));

    camera.left = -size.x / 2;
    camera.right = size.x / 2;
    camera.top = size.y / 2;
    camera.bottom = -size.y / 2;
    camera.updateProjectionMatrix();

    wave.setSize(size.x, size.y);
    wave.setResolution(size.x, size.y);

    font_name.setScale((Math.max(size.x, size.y) * 0.1) / font_name.getHeight());

    font_ideas.setScale((size.y * 0.0135) / font_ideas.getHeight());
    font_ideas.setPosition(0, -size.y / 2 + size.y * 0.12 + font_ideas.getScale() * font_ideas.getHeight() * 0, -1);
    font_ideas.updateDom();

    font_posts.setScale((size.y * 0.0135) / font_posts.getHeight());
    font_posts.setPosition(0, -size.y / 2 + size.y * 0.12 - font_posts.getScale() * font_posts.getHeight() * 2, -1);
    font_posts.updateDom();

    font_github.setScale((size.y * 0.0135) / font_github.getHeight());
    font_github.setPosition(0, -size.y / 2 + size.y * 0.12 - font_github.getScale() * font_github.getHeight() * 4, -1);
    font_github.updateDom();
});

function Home() {
    return <></>;
}

export default Home;
