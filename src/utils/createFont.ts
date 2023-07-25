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
    fontWeight: 400,
    fontFamily: 'Fira Code',
});
await split(LXGWWENKAI_REGULAR_400_INPUT_PATH, LXGWWENKAI_REGULAR_400_OUTPUT_PATH, {
    fontWeight: 400,
    fontFamily: 'LXGW WenKai',
});
await split(LXGWWENKAI_BOLD_700_INPUT_PATH, LXGWWENKAI_BOLD_700_OUTPUT_PATH, {
    fontWeight: 700,
    fontFamily: 'LXGW WenKai',
});
await split(LXGWWENKAIMONO_REGULAR_400_INPUT_PATH, LXGWWENKAIMONO_REGULAR_400_OUTPUT_PATH, {
    fontWeight: 400,
    fontFamily: 'LXGW WenKai Mono',
});

async function split(inputPath: string, outputPath: string, cssProps: {}) {
    await fontSplit({
        FontPath: inputPath,
        destFold: outputPath,
        targetType: 'woff2',
        chunkSize: 75 * 1024, // 75kb
        testHTML: false,
        reporter: false,
        threads: {}, // 开启多线程
        css: cssProps,
    });
}
