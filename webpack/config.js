const configuration = require( "../generator/article/config" );
const paths = [];

configuration.forEach( folder => {

    folder.children.forEach( file => {

        const path = { input: file.htmlPath, output: file.buildPath };

        paths.push( path );

    } );

} );

module.exports = paths.map( path => {

    return {
        filename: path.output,
        template: path.input,
    };

} );
