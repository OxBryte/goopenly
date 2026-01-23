#!/usr/bin/env node

const { execSync } = require("child_process");

function hasChanges() {
  try {
    const status = execSync("git status --porcelain").toString();
    return status.trim().length > 0;
  } catch (e) {
    console.error("Error checking git status:", e);
    return false;
  }
}

function doCommit() {
  if (!hasChanges()) {
    console.log("[auto-commit] No changes to commit.");
    return;
  }
  const timestamp = new Date()
    .toISOString()
    .replace("T", " ")
    .replace(/\..+/, "");
  try {
    execSync("git add -A", { stdio: "inherit" });
    execSync(`git commit -m "feat: update"`, { stdio: "inherit" });
    console.log(`[auto-commit] Committed changes at ${timestamp}`);
  } catch (e) {
    console.error("[auto-commit] Error during commit:", e);
  }
}

// Initial commit on startup
console.log("[auto-commit] Checking for changes on startup...");
doCommit();

// Commit every 20 seconds
setInterval(() => {
  console.log("[auto-commit] Checking for changes...");
  doCommit();
}, 20 * 1000);
