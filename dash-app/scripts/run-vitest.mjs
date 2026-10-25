#!/usr/bin/env node
/**
 * Vitest launcher that works around a Vite limitation in this repository.
 *
 * The project lives in a directory whose name contains "#" (`Dash#`). Vite
 * parses that character as a URL fragment, which corrupts module ids and makes
 * `vitest` fail before any test runs. CI checks the repository out under a
 * plain path, so the workaround only applies locally: the project is copied to
 * a temporary directory (source files are small; `node_modules` is hard-linked)
 * and Vitest runs there.
 *
 * Usage: `npm test` / `node scripts/run-vitest.mjs [vitest args]`.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const args = process.argv.slice(2);

function runVitest(cwd) {
  const vitestBin = path.join(cwd, "node_modules", "vitest", "vitest.mjs");
  const result = spawnSync(process.execPath, [vitestBin, "run", ...args], {
    cwd,
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
}

if (!projectDir.includes("#")) {
  runVitest(projectDir);
}

const shadowDir = path.join(os.tmpdir(), "dash-sharp-vitest");
const excluded = new Set([
  "node_modules",
  ".next",
  ".git",
  "coverage",
  "test-results",
  "playwright-report",
  "blob-report",
]);

fs.rmSync(shadowDir, { recursive: true, force: true });
fs.mkdirSync(shadowDir, { recursive: true });

for (const entry of fs.readdirSync(projectDir)) {
  if (excluded.has(entry)) continue;
  fs.cpSync(path.join(projectDir, entry), path.join(shadowDir, entry), {
    recursive: true,
  });
}

// Hard-link node_modules so the copy stays cheap while keeping every module
// path inside the temporary directory.
const link = spawnSync(
  "cp",
  ["-al", path.join(projectDir, "node_modules"), path.join(shadowDir, "node_modules")],
  { stdio: "inherit" },
);

if (link.status !== 0) {
  console.error(
    "Could not hard-link node_modules. Run `npm install` and try again.",
  );
  process.exit(link.status ?? 1);
}

runVitest(shadowDir);
