import esbuild from "esbuild";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const isWatch = process.argv.includes("--watch");

await mkdir(new URL("../dist/", import.meta.url), { recursive: true });

const common = {
  entryPoints: [fileURLToPath(new URL("../src/pica-entry.js", import.meta.url))],
  bundle: true,
  sourcemap: true,
  target: ["es2018"],
  logLevel: "info",
};

/** @type {import('esbuild').BuildOptions[]} */
const builds = [
  // ESM build (best for modern browsers / ESM CDNs).
  {
    ...common,
    format: "esm",
    outfile: fileURLToPath(new URL("../dist/pica.esm.js", import.meta.url)),
  },
  // Classic <script> build (globalThis.pica).
  {
    ...common,
    format: "iife",
    globalName: "pica",
    outfile: fileURLToPath(new URL("../dist/pica.iife.js", import.meta.url)),
  },
  // Minified classic <script> build (globalThis.pica).
  {
    ...common,
    format: "iife",
    globalName: "pica",
    minify: true,
    outfile: fileURLToPath(new URL("../dist/pica.iife.min.js", import.meta.url)),
  },
];

if (isWatch) {
  const ctxs = await Promise.all(builds.map((b) => esbuild.context(b)));
  await Promise.all(ctxs.map((c) => c.watch()));
  console.log("Watching…");
} else {
  await Promise.all(builds.map((b) => esbuild.build(b)));
}
