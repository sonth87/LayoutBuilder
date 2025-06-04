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
      path: path.resolve(__dirname, 'dist'),
      filename: "[name].min.js",
      library: {
        type: "umd", // Universal Module Definition format
        name: "preset-web", // This should match the name in your plugin
        export: "default" // Explicitly set default export
      },
      globalObject: 'this' // Ensures compatibility in both browser and Node.js
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
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    // Merge any additional configuration from grapesjs-cli
    ...inputConfig
  };

  return config;
};
