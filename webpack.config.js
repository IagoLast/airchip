const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    'bundle.js': './index.js',
    'airship': './styles/main.scss'
  },
  output: {
    filename: '[name]'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        "sass-loader"
      ]
    }]
  },
  plugins: [
   new MiniCssExtractPlugin({
     // Options similar to the same options in webpackOptions.output
     // both options are optional
     filename: "[name].css",
     chunkFilename: "[id].css"
   })
 ],
};
