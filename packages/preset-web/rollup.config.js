import typescript from "rollup-plugin-typescript2";
import { obfuscator } from "rollup-obfuscator";
import del from "rollup-plugin-delete";
import copy from "rollup-plugin-copy";

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
    typescript({
      useTsconfigDeclarationDir: false,
    }),
    obfuscator(),
    copy({
      targets: [{ src: "./dist/**/*", dest: "./build/dist/" }],
      hook: "writeBundle",
    }),
  ],
  external: ["grapesjs", "juice"],
};
