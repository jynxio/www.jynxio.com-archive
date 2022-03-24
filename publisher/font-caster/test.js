const fontcaster = require( "font-caster" );

/**
 * 字体子集化。
 * @param { Object } options - 参数。
 * @param { string } options.htmlFilesPath - html文本的路径或存储html文本的目录的路径，比如"./page/example.html"或"./page"。
 * @param { string } [ options.textFilesPath ] - （可选）txt文本的地址，比如"./static/font/character-set.txt"。txt文本代表“参与
 * 字体子集化的额外字符集”，若指定了该参数，则代表txt文本和html文本会一起参与字体子集化，否则只有html文本会参与字体子集化。
 * @param { string } [ options.isUnicode = false ] - （可选）默认值为false。代表txt文本的内容的格式，若值为false，则表示txt的内容是普
 * 通的字符串，若值为true，则表示txt的内容是以逗号分隔的unicode（基于十进制）。
 * @param { string } originFontPath - 原始的字体文件的路径，比如 "./origin.otf"，也支持 ttf、woff。
 * @param { string } subsetFontPath - 生成的字体文件的路径，比如 "./sunset.otf"，生成的字体文件的格式必须与生原始的字体文件的格式一致。
 * @returns { Promise } - Promise代表是否子集化成功，若成功则返回{}
 */
