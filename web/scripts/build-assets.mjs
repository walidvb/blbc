import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const web = resolve(root, "web");
const www = resolve(root, "www");
const publicDir = resolve(web, "public");
const stylesDir = resolve(publicDir, "stylesheets");
const scriptsDir = resolve(publicDir, "javascripts");

mkdirSync(publicDir, { recursive: true });
rmSync(stylesDir, { recursive: true, force: true });
mkdirSync(stylesDir, { recursive: true });
cpSync(resolve(www, "stylesheets/legacy.css"), resolve(stylesDir, "legacy.css"));
cpSync(resolve(www, "stylesheets/fonts"), resolve(stylesDir, "fonts"), {
  recursive: true,
});

mkdirSync(scriptsDir, { recursive: true });

const siteCore = readFileSync(resolve(web, "scripts/site-core.js"), "utf8");
writeFileSync(resolve(scriptsDir, "site.js"), siteCore);
