const fs = require("fs");
const path = require("path");

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;

  // Clean specific instances of ? or 
  if (content.includes("Keyword Bot Rules") || content.includes("Canned Snippets")) {
    content = content.replace(/\Keyword Bot Rules/g, "Keyword Bot Rules");
    content = content.replace(/\?\? Canned Snippets/g, "Canned Snippets");
    changed = true;
  }

  if (content.includes("Facebook Lead captured")) {
    content = content.replace(/\Facebook Lead captured/g, "Facebook Lead captured");
    changed = true;
  }

  if (content.includes("? ")) {
    content = content.replace(/\? (Quick test:|Fees & Packages|Clinic Location|Timings|Sciatica)/g, "$1");
    changed = true;
  }

  if (content.includes("")) {
    content = content.replace(/\?\?/g, "");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("Cleaned question marks from:", filePath);
  }
}

function traverse(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (item !== "node_modules" && item !== ".next" && item !== ".git") traverse(full);
    } else if (/\.(ts|tsx|js|json|prisma)$/.test(item)) {
      cleanFile(full);
    }
  }
}

traverse(".");
