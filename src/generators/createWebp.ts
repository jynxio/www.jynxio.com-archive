import path from 'node:path';
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { emptyDir, ensureDir } from 'fs-extra';

const map = new Map<string, string>(); // <dirent.path, webpDirPath>
const dirents = await readdir(path.resolve() + '/blog/image', { withFileTypes: true, recursive: true });

await emptyDir(path.resolve() + '/public/blog/image');

for (const dirent of dirents) {
	if (!dirent.isFile()) continue;
	if (map.get(dirent.path) === undefined) {
		const webpDirPath = path.resolve() + '/public' + dirent.path.split(path.resolve())[1];

		map.set(dirent.path, webpDirPath);
		ensureDir(webpDirPath);
	}

	if (dirent.name === '.DS_Store') continue;

	const inputPath = dirent.path + '/' + dirent.name;
	const outputPath = map.get(dirent.path) + '/' + dirent.name.slice(0, -4) + '.webp';

	try {
		await sharp(inputPath).webp({ lossless: true }).toFile(outputPath);
	} catch (error) {
		console.log(error);
		console.log(inputPath);
	}
}
