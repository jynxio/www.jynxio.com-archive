import { readFile, readdir } from "node:fs/promises";

/*  */
const SVG_STRING_LINK = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-external-link\"><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path><polyline points=\"15 3 21 3 21 9\"></polyline><line x1=\"10\" x2=\"21\" y1=\"14\" y2=\"3\"></line></svg>";
const SVG_STRING_CHECKBOX = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-check-square\"><polyline points=\"9 11 12 14 22 4\"></polyline><path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"></path></svg>";
const SVG_STRING_COPY = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"></rect><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"></path><polyline points=\"20 6 9 17 4 12\"></polyline><line x1=\"18\" x2=\"6\" y1=\"6\" y2=\"18\"></line><line x1=\"6\" x2=\"18\" y1=\"6\" y2=\"18\"></line></svg>";
const SVG_STRING_COLLAPSE = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-chevron-down\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>";

/*  */
const dirPath = new URL( "../asset/catalog/skeleton.json", import.meta.url );
const dirData = JSON.parse( await readFile( dirPath, { encoding: "utf8" } ) );
const files = await Promise.all( dirData.map( ( { name } ) => {

	const path = new URL( `../../post/post/${ name }`, import.meta.url );

	return readdir( path );

} ) );

console.log( dirData );

/*  */
function main ( markdown ) {

}

function createCatalog () {}
