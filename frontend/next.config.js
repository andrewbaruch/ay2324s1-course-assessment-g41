const withTM = require("next-transpile-modules")([
  // `monaco-editor` isn't published to npm correctly: it includes both CSS
  // imports and non-Node friendly syntax, so it needs to be compiled.
  "monaco-editor"
]);
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  webpack: (config, options) => {
    if (options.isServer) {
      return config
    }

    config.plugins.push(
      new MonacoWebpackPlugin()
    );

    // Monaco Editor to be available globally
    config.resolve.alias = {
      ...config.resolve.alias,
      "monaco-editor": "monaco-editor/esm/vs/editor/editor.api"
    }

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = withTM(nextConfig);
