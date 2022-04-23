const configuration = require( "../generator/article/config" );
const createIndex = ( function() {

    const generator = createGenerator();

    return ( _ => generator.next().value );

    function* createGenerator() {

        let count = 0;

        while ( true ) yield ++count;

    }

} )();

module.exports = configuration.map( item => {

    return {
        filename: "./article/" + createIndex() + ".html",
        template: item.output,
    };

} );
