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
    
    const rule = config.module.rules
      .find(rule => rule.oneOf)
      .oneOf.find(
        r =>
          // Find the global CSS loader
          r.issuer && r.issuer.include && r.issuer.include.includes("_app")
      );
    if (rule) {
      rule.issuer.include = [
        rule.issuer.include,
        // Allow `monaco-editor` to import global CSS:
        /[\\/]node_modules[\\/]monaco-editor[\\/]/
      ];
    }

    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: [
          "json",
          "markdown",
          "css",
          "typescript",
          "javascript",
          "html",
          "graphql",
          "python",
          "scss",
          "yaml"
        ],
        filename: "static/[name].worker.js"
      })
    );

    // Monaco Editor to be available globally
    config.resolve.alias = {
      ...config.resolve.alias,
      "monaco-editor": "monaco-editor/esm/vs/editor/editor.api"
    }

    return config;
    // if (!options.isServer) {
    //   const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")
    //   config.plugins.push(new MonacoWebpackPlugin({
    //     filename: 'static/[name].worker.js',
    //   }))
    // }
    // return config
  }
};

module.exports = withTM(nextConfig);
