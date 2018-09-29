module.exports = {
	entry: './src/index.tsx',
	output: {
		filename: 'bundle.js',
		path: __dirname + '/build',
	},
	devtool: 'source-map',
	devServer: {
		port: 4000,
	},
	resolve: {
		extensions: [
			'.ts',
			'.tsx',
			'.js',
			'.json',
		],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader',
			},
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'source-map-loader',
			},
		],
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
	},
};