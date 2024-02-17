import path from 'node:path';
import sharp from 'sharp';
import * as node from 'fs-extra';

const set = new Set<string>();
const dirents = await node.readdir(path.resolve() + '/blog/image', { withFileTypes: true, recursive: true });

await node.emptyDir(path.resolve() + '/public/blog/image');

for (const dirent of dirents) {
	if (!dirent.isFile()) continue;
	if (dirent.name.includes('.DS_Store')) continue;

	const dirPath = path.dirname(dirent.name);
	const fileName = path.basename(dirent.name).replace(path.extname(dirent.name), '');

	if (!set.has(dirPath)) {
		set.add(dirPath);
		node.ensureDir(path.resolve() + '/public/blog/image/' + dirPath);
	}

	const originImgPath = path.resolve() + '/blog/image/' + dirent.name;
	const targetImgPath = path.resolve() + '/public/blog/image/' + dirPath + '/' + fileName + '.webp';

	await sharp(originImgPath).webp({ lossless: true }).toFile(targetImgPath);
}
