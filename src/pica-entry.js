// Browser-friendly entrypoint for bundlers.
//
// The upstream package exports a function (pica factory) as the default export.
// We re-export it for ESM and also ensure the IIFE build sets globalThis.pica.
import pica from "pica";

export default pica;
