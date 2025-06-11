import typescript from "rollup-plugin-typescript2";

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
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ],
  external: ["grapesjs", "juice"],
  plugins: [typescript()],
};
