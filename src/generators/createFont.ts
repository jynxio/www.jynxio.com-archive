import path from 'node:path';
import { fontSplit } from '@konghayao/cn-font-split';

const FIRACODE_REGULAR_400_INPUT_PATH = path.resolve() + '/src/temps/fonts/raw/firacode-regular-400.ttf';
const FIRACODE_REGULAR_400_OUTPUT_PATH = path.resolve() + '/src/temps/fonts/process/firacode-regular-400';

const LXGWWENKAI_REGULAR_400_INPUT_PATH = path.resolve() + '/src/temps/fonts/raw/lxgwwenkai-regular-400.ttf';
const LXGWWENKAI_REGULAR_400_OUTPUT_PATH = path.resolve() + '/src/temps/fonts/process/lxgwwenkai-regular-400';

const LXGWWENKAI_BOLD_700_INPUT_PATH = path.resolve() + '/src/temps/fonts/raw/lxgwwenkai-bold-700.ttf';
const LXGWWENKAI_BOLD_700_OUTPUT_PATH = path.resolve() + '/src/temps/fonts/process/lxgwwenkai-bold-700';

const LXGWWENKAIMONO_REGULAR_400_INPUT_PATH = path.resolve() + '/src/temps/fonts/raw/lxgwwenkaimono-regular-400.ttf';
const LXGWWENKAIMONO_REGULAR_400_OUTPUT_PATH = path.resolve() + '/src/temps/fonts/process/lxgwwenkaimono-regular-400';

await split(FIRACODE_REGULAR_400_INPUT_PATH, FIRACODE_REGULAR_400_OUTPUT_PATH, {
    fontFamily: 'Fira Code',
    fontStyle: 'normal',
    fontWeight: 400,
    fontDisplay: 'swap',
});
await split(LXGWWENKAI_REGULAR_400_INPUT_PATH, LXGWWENKAI_REGULAR_400_OUTPUT_PATH, {
    fontFamily: '霞鹜文楷',
    fontStyle: 'normal',
    fontWeight: 400,
    fontDisplay: 'swap',
});
await split(LXGWWENKAI_BOLD_700_INPUT_PATH, LXGWWENKAI_BOLD_700_OUTPUT_PATH, {
    fontFamily: '霞鹜文楷',
    fontStyle: 'normal',
    fontWeight: 700,
    fontDisplay: 'swap',
});
await split(LXGWWENKAIMONO_REGULAR_400_INPUT_PATH, LXGWWENKAIMONO_REGULAR_400_OUTPUT_PATH, {
    fontFamily: '霞鹜文楷等宽',
    fontStyle: 'normal',
    fontWeight: 400,
    fontDisplay: 'swap',
});

async function split(inputPath: string, outputPath: string, cssProps: {}) {
    await fontSplit({
        FontPath: inputPath,
        destFold: outputPath,
        targetType: 'woff2',
        chunkSize: 70 * 1024, // 70kb
        testHTML: false,
        reporter: false,
        threads: {}, // 开启多线程
        css: cssProps,
        cssFileName: 'index.css',
    });
}
