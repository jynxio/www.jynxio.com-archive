import { Line } from "three";
import { BufferGeometry } from "three";
import { LineBasicMaterial } from "three";
import { Float32BufferAttribute } from "three";

export default class Scroll {

    constructor( length ) {

        const positions = [ 0, length / 2, 0, 0, - length / 2, 0 ];
        const geometry = new BufferGeometry();

        geometry.setAttribute( "position", new Float32BufferAttribute( positions, 3 ) );
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        const material = new LineBasicMaterial( {
            linewidth: 1,
            color: 0xffffff,
            vertexColors: false,
            linecap: "square"
        } );
        const line = new Line( geometry, material );

        this._line = line;

    }

    get() {

        return this._line;

    }

    setPosition( x, y, z ) {

        this.get().position.set( x, y, z );

    }

    setScale( value ) {

        this.get().scale.set( value, value, value );

    }

}