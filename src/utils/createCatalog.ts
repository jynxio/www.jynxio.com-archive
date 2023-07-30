import { readFileSync, readdirSync, writeFileSync, statSync, createReadStream } from 'node:fs';
import { emptyDir } from 'fs-extra';
import path from 'node:path';

const INPUT_PATH = path.resolve() + '/src/configs/baseCatalog.json';
const OUTPUT_PATH = path.resolve() + '/src/temps/configs/detailCatalog.json';
const BLOG_BASE_PATH = path.resolve() + '/blog/post/';

await emptyDir(path.resolve() + '/src/temps/configs');

main();

async function main() {
    /**
     * 创建目录的JSON
     */
    const dirPromises = [];
    const baseCatalog = JSON.parse(readFileSync(INPUT_PATH, 'utf8'));

    for (const dir of baseCatalog) {
        const aliasPromises = [];
        const dirAddress = BLOG_BASE_PATH + dir.name;
        const dirents = readdirSync(dirAddress, {
            encoding: 'utf8',
            withFileTypes: true,
        });

        dir.children = [];

        for (const dirent of dirents) {
            const fileAddress = dirAddress + '/' + dirent.name;
            const name = dirent.name.trim().slice(0, -3);
            const time = createTime(fileAddress);

            dir.children.push({ name, time });
            aliasPromises.push(createHeading(fileAddress));
        }

        dirPromises.push(Promise.all(aliasPromises));
    }

    (await Promise.all(dirPromises)).forEach((aliases, index) => {
        const children = baseCatalog[index].children;

        aliases.forEach((alias, index) => {
            children[index].alias = alias;
        });
    });

    /**
     * 写入为一个JSON文件
     */
    writeFileSync(OUTPUT_PATH, JSON.stringify(baseCatalog), {
        encoding: 'utf8',
    });
}

/**
 * （异步）获取markdown文件的标题
 * @param { string } path markdown文件的路径
 * @returns { Promise } 敲定值是标题字符串，拒绝值是Error实例。
 */
function createHeading(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let string = '';

        const reader = createReadStream(path, {
            encoding: 'utf8',
            highWaterMark: 1024,
        });

        reader.on('data', (chunk: string) => {
            string += chunk;
            reader.destroy();
        });
        reader.on('error', (error: Error) => reject(error));
        reader.on('close', () => {
            const fromIndex = string.indexOf('# ') + 2;
            const toIndex = string.indexOf('\n', fromIndex);
            const heading = string.slice(fromIndex, toIndex).trim();

            resolve(heading);
        });
    });
}

/**
 * 获取文件的最后修改时间
 * @param { string } path 文件的绝对路径
 * @returns { string } 最后修改时间的日期字符串
 */
function createTime(path: string): string {
    const iso = statSync(path).mtime;
    const date = new Date(iso);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const minute = ('0' + date.getMinutes()).slice(-2);

    return `${year}/${month}/${day} ${hour}:${minute}`;
}
