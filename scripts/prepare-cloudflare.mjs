import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

// The docs framework scans source files at runtime. Workers provide a writable
// /tmp filesystem scoped to each request, so bundle those sources with the app.
const files = {};
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(filename);
    else if (/\.(mdx?|tsx?|json)$/.test(entry.name)) {
      files[filename] = await readFile(filename, "utf8");
    }
  }
}
await collect("app/docs");
await collect("public/skills");
for (const filename of ["docs.config.tsx", "package.json"]) {
  files[filename] = await readFile(filename, "utf8");
}
await writeFile(".open-next/cloudflare/docs-files.json", JSON.stringify(files));
const workerPath = ".open-next/worker.js";
let worker = await readFile(workerPath, "utf8");
worker = `import { mkdirSync, writeFileSync } from "node:fs";
import docsFiles from "./cloudflare/docs-files.json";
function prepareDocsFilesystem() {
  for (const [filename, content] of Object.entries(docsFiles)) {
    const target = "/tmp/blyp-docs/" + filename;
    mkdirSync(target.slice(0, target.lastIndexOf("/")), { recursive: true });
    writeFileSync(target, content);
  }
}
` + worker.replace("async fetch(request, env, ctx) {", `async fetch(request, env, ctx) {
        const incomingUrl = new URL(request.url);
        if (incomingUrl.hostname === "blyp.dev") {
            incomingUrl.hostname = "www.blyp.dev";
            return Response.redirect(incomingUrl.toString(), 308);
        }
        prepareDocsFilesystem();`);
await writeFile(workerPath, worker);
