/** @type {import('next').NextConfig} */
const path = require("path");
const webpack = require("webpack");
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  output: "standalone",
  swcMinify: true,
  experimental: {
    forceSwcTransforms: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: "frontmatter-markdown-loader",
    });

    config.plugins.push(
      new webpack.EnvironmentPlugin({
        NODE_ENV: process.env.NODE_ENV,
      })
    );

    return config;
  },
};

module.exports = withNextIntl({ ...nextConfig });
