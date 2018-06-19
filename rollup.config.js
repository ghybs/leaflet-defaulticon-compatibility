import { uglify } from 'rollup-plugin-uglify';
import copy from 'rollup-plugin-copy';


export default [{
	// Bundled, non-minified version.
	input: 'src/Icon.Default.compatibility.js',
	output: {
		file: 'dist/leaflet-defaulticon-compatibility.js',
		format: 'umd',
		name: 'leaflet-defaulticon-compatibility',
		globals: {
			'leaflet': 'L',
		},
	},
	external: [
		'leaflet',
	],
    plugins: [
        copy({
			//'node_modules/leaflet/dist/images': 'dist/images',
            //verbose: true
        }),
    ],
}, {
	// Bundled, minified version.
	input: 'src/Icon.Default.compatibility.js',
	output: {
		file: 'dist/leaflet-defaulticon-compatibility.min.js',
		format: 'umd',
		name: 'leaflet-defaulticon-compatibility',
		globals: {
			'leaflet': 'L',
		},
	},
	external: [
		'leaflet',
	],
    plugins: [
        copy({
			//'node_modules/leaflet/dist/images': 'dist/images',
            //verbose: true
		}),
		uglify(),
    ],
}];
