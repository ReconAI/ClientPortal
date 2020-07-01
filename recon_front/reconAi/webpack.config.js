const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      $ENV: {
        RECON_API_URL: JSON.stringify(process.env.RECON_API_URL)
      }
    }),
  ],
};
