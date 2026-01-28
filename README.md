# pica CDN build

This repo bundles [`nodeca/pica`](https://github.com/nodeca/pica) into browser-ready files you can host on any static CDN.

## Build

```bash
npm install
npm run build
```

Outputs:

- `dist/pica.esm.js` (ES module)
- `dist/pica.iife.js` (classic `<script>` build, exposes `globalThis.pica`)
- `dist/pica.iife.min.js` (minified classic build)

## Use via CDN

### Classic `<script>` (global)

```html
<script src="https://your-cdn.example/pica.iife.min.js"></script>
<script>
  const p = window.pica();
  // await p.resize(from, to)
</script>
```

### ESM

```html
<script type="module">
  import pica from "https://your-cdn.example/pica.esm.js";
  const p = pica();
</script>
```

## Local demo

After building, open `index.html` (served from a static server).

Example:

```bash
npx serve .
```

