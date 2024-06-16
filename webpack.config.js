const Dotenv = require("dotenv");
const webpack = require("webpack");

Dotenv.config();

module.exports = (env) => {
  return {
    plugins: [
      new Dotenv(),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(process.env),
      }),
    ],
  };
};
