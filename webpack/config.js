const config = require( "../generator/article/config" );
const flattened_array = [];

config.forEach( scope => {

    scope.content.forEach( item => {

        flattened_array.push( { indexName: item.indexName, outputPath: item.outputPath } );

    } );

} );

module.exports = flattened_array.map( item => {

    return {
        filename: item.indexName + ".html",
        template: item.outputPath,
    };

} );
