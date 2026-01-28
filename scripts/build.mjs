import esbuild from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
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
  await writeDemoHtml();
  console.log("Watching…");
} else {
  await Promise.all(builds.map((b) => esbuild.build(b)));
  await writeDemoHtml();
}

async function writeDemoHtml() {
  // Make dist/ deployable as a static site (e.g. on Vercel) by
  // copying root index.html to dist/index.html and rewriting the script path.
  const rootHtmlPath = fileURLToPath(new URL("../index.html", import.meta.url));
  const outHtmlPath = fileURLToPath(new URL("../dist/index.html", import.meta.url));
  const html = await readFile(rootHtmlPath, "utf8");

  // Root demo references ./dist/... because it’s served from repo root.
  // In dist/ we want to reference bundles next to the HTML file.
  const rewritten = html.replaceAll("./dist/", "./");
  await writeFile(outHtmlPath, rewritten, "utf8");
}
