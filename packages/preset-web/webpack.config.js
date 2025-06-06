const path = require("path");

module.exports = (env = {}) => {
  // Handle both direct webpack call and grapesjs-cli call
  const inputConfig = env.config || {};
  const isProduction = process.env.NODE_ENV === "production" || env.production;

  const config = {
    mode: isProduction ? "production" : "development",
    entry: {
      "preset-web": "./src/index.ts",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].min.js", // Force this specific filename regardless of entry point name
      library: {
        type: "umd", // Universal Module Definition format
        name: "preset-web", // This should match the name in your plugin
        export: "default", // Explicitly set default export
      },
      globalObject: "this", // Ensures compatibility in both browser and Node.js
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, "."),
        watch: true,
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          loader: "ts-loader",
          exclude: ["/node_modules/"],
        },
        // Fix CSS loader issue - update to include node_modules
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
          include: [
            path.resolve(__dirname, "src"),
            path.resolve(__dirname, "node_modules"),
          ],
        },
        // Add SCSS handling rules
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".css", ".scss"],
      modules: ["node_modules"],
    },
  };

  // Merge any additional configuration from grapesjs-cli, but preserve our output settings
  const mergedConfig = {
    ...config,
    ...inputConfig,
    output: {
      ...config.output,
      ...(inputConfig.output || {}),
      filename: "preset-web.min.js", // Force this filename even after merge
    },
  };

  return mergedConfig;
};
