import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const version = process.argv[2];

if (!version) {
	console.error("Usage: npm run coursedeck:version -- <version>");
	process.exit(1);
}

if (!/^[A-Za-z0-9._-]+$/.test(version)) {
	console.error(
		"Version must contain only letters, numbers, dots, underscores, or hyphens.",
	);
	process.exit(1);
}

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const wranglerPath = join(root, "wrangler.json");
const wranglerJson = await readFile(wranglerPath, "utf8");
JSON.parse(wranglerJson);

const coursedeckVersionPattern = /("COURSEDECK_VERSION"\s*:\s*)"[^"]*"/;

if (!coursedeckVersionPattern.test(wranglerJson)) {
	console.error("COURSEDECK_VERSION was not found in wrangler.json");
	process.exit(1);
}

const nextWranglerJson = wranglerJson.replace(
	coursedeckVersionPattern,
	`$1"${version}"`,
);

await writeFile(wranglerPath, nextWranglerJson);

console.log(`COURSEDECK_VERSION set to ${version}`);
