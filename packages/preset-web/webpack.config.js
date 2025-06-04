const isProduction = process.env.NODE_ENV == "production";
var path = require("path");

module.exports = ({ config }) => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return {
    ...config,
    entry: {
      "preset-web": "./src/index.ts",
    },
    output: {
      ...config.output,
      filename: "[name].min.js",
      library: {
        type: "umd", // Universal Module Definition format
        name: "presetWeb",
        export: "default" // Explicitly set default export
      },
      globalObject: 'this' // Ensures compatibility in both browser and Node.js
    },
    devServer: {
      ...config.devServer,
      static: {
        directory: path.resolve(__dirname, "."),
        watch: true,
      },
    },
  };
};
