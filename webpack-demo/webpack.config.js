const path = require('path');
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');

const assetsExtensionsRE = /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/;

// To be extended later on.
const configBase = {
	mode: 'production',
	entry: path.join(__dirname, 'index.js'),
	output: {
		path: path.join(__dirname, '..', 'docs'),
		//filename: 'index_bundle.js', // To be defined later on.
	},
	module: {
		rules: [{
			// https://webpack.js.org/loaders/style-loader/
			test: /\.css$/,
			use: [
				{ loader: 'style-loader' },
				{ loader: 'css-loader' },
			],
		}],
	},
	resolve: { // https://webpack.js.org/configuration/resolve/
		alias: { // https://webpack.js.org/configuration/resolve/#resolve-alias
			'leaflet-defaulticon-compatibility': '..', // Use the plugin project directly as package.
			'leaflet': path.join(__dirname, 'node_modules', 'leaflet'), // Due to above trick, webpack tries to find leaflet in plugin project node_modules and fails. Redirect to webpack-demo/node_modules instead.
		},
	},
};

// Configuration with file-loader (copy assets in target folder with hashed filename).
const configFile = webpackMerge(configBase, {
	output: {
		filename: 'webpack-file.js',
	},
	module: {
		rules: [{
			test: assetsExtensionsRE,
			loader: 'file-loader', // https://webpack.js.org/loaders/file-loader/
			options: {
				outputPath: 'assets',
			},
		}],
	},
	plugins: [
		new webpack.DefinePlugin({ // https://webpack.js.org/plugins/define-plugin/
			'DEMO_VERSION': '"Webpack with file-loader (hashed file name images)"',
			'ASSET_LOADER': '"file-loader"',
		}),
	],
});

// Configuration with url-loader (inline assets).
const configBase64 = webpackMerge(configBase, {
	output: {
		filename: 'webpack-base64.js',
	},
	module: {
		rules: [{
			test: assetsExtensionsRE,
			loader: 'url-loader', // https://webpack.js.org/loaders/url-loader/
		}],
	},
	plugins: [
		new webpack.DefinePlugin({ // https://webpack.js.org/plugins/define-plugin/
			'DEMO_VERSION': '"Webpack with url-loader (Data URI / base64 inline images)"',
			'ASSET_LOADER': '"url-loader"',
		}),
	],
});

// Configuration without leaflet-defaulticon-compatibility plugin.
const configNoPlugin = webpackMerge(configBase, {
	output: {
		filename: 'webpack-no-plugin.js',
	},
	module: {
		rules: [{
			test: assetsExtensionsRE,
			loader: 'url-loader',
		}],
	},
	plugins: [
		new webpack.DefinePlugin({ // https://webpack.js.org/plugins/define-plugin/
			'DEMO_VERSION': '"Webpack without leaflet-defaulticon-compatibility plugin"',
			'ASSET_LOADER': '"url-loader"',
		}),
	],
	externals: {
		// Replace by dummy globals.
		'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css': 'this leaflet-defaulticon-compatibility',
		'leaflet-defaulticon-compatibility': 'this leaflet-defaulticon-compatibility',
	},
});


// Build all bundles at once, exporting an array of configs for multi-compiler mode.
module.exports = [
	configFile,
	configBase64,
	configNoPlugin,
];
