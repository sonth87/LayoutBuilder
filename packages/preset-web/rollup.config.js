import typescript from "rollup-plugin-typescript2";
import { obfuscator } from "rollup-obfuscator";
import del from "rollup-plugin-delete";
import copy from "rollup-plugin-copy";
// import postcss from "rollup-plugin-postcss";
// import autoprefixer from "autoprefixer";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "es",
      exports: "auto",
    },
  ],
  plugins: [
    del({ targets: ["./dist/*", "./build/dist/*"] }),
    // postcss({
    //   include: "./src/style/main.scss",
    //   extract: "preset-web.css", // Tên file CSS output
    //   minimize: true,
    //   sourceMap: false,
    //   use: [
    //     [
    //       "sass",
    //       {
    //         includePaths: ["./src/style", "./node_modules"],
    //       },
    //     ],
    //   ],
    //   plugins: [autoprefixer()],
    //   inject: false,
    // }),
    typescript({
      useTsconfigDeclarationDir: false,
    }),
    obfuscator(),
    // copy({
    //   targets: [{ src: "./dist/**/*", dest: "./build/dist/" }],
    //   hook: "writeBundle",
    // }),
  ],
  external: ["grapesjs", "juice"],
};
