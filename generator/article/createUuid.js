const createUuid = ( function() {

    const generator = createGenerator();

    return ( _ => generator.next().value );

    function* createGenerator() {

        let count = 0;

        while ( true ) yield ( ++count + "" );

    }

} )();

module.exports = { createUuid };
