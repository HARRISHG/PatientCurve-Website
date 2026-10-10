// Renders the React app to static HTML after the client build, so the page
// (and the Netlify form inside it) is in index.html before any JavaScript runs.
import { readFile, writeFile, rm } from "node:fs/promises";

const { render } = await import("../dist-ssr/entry-server.js");
const file = new URL("../dist/index.html", import.meta.url);
const template = await readFile(file, "utf8");
if (!template.includes("<!--app-html-->")) throw new Error("index.html is missing <!--app-html-->");
await writeFile(file, template.replace("<!--app-html-->", render()));
await rm(new URL("../dist-ssr", import.meta.url), { recursive: true, force: true });
console.log("Prerendered dist/index.html");
