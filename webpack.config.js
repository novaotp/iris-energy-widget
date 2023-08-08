const path = require('path');
const glob = require('glob')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");

module.exports = {
  entry: './src/app/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      // ... other rules
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, "./src")}/**/*`, { nodir: true }),
    }),
    new HtmlWebpackPlugin({
        template: './src/app/index.html',
        minify: {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
        }
    })
]
};
