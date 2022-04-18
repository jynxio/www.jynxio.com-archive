import { Line } from "three";
import { BufferGeometry } from "three";
import { LineBasicMaterial } from "three";
import { Float32BufferAttribute } from "three";

export default class Scroll {

    constructor( length ) {

        const positions = [
            0,   length / 2, 0,
            0, - length / 2, 0
        ];
        const colors = [
            Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1,
            Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1,
        ];
        const geometry = new BufferGeometry();

        geometry.setAttribute( "position", new Float32BufferAttribute( positions, 3 ) );
        geometry.setAttribute( "color", new Float32BufferAttribute( colors, 3 ) );
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        const material = new LineBasicMaterial( {
            linewidth: 1,
            vertexColors: true,
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