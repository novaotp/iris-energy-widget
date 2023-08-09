const path = require('path');
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: './src/app/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true,  // Drops console statements
          drop_debugger: true, // Drops debugger statements
          pure_funcs: ['console.log'] // Removes the specific calls
        },
        mangle: {
          // Mangle props here if needed
        },
        output: {
          comments: false,  // Remove all comments
        },
      },
      extractComments: false,  // Do not extract comments to a separate file
    })],
  },
};
