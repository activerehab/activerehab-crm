const fs = require("fs");
const path = require("path");

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;

  if (content.includes("ActiveRehab Chiropractic & Osteopathy Centre") || content.includes("ActiveRehab Chiropractic & Osteopathy Centre") || content.includes("ActiveRehab")) {
    content = content.replace(/ActiveRehab Chiropractic & Osteopathy Centre/g, "ActiveRehab Chiropractic & Osteopathy Centre");
    content = content.replace(/ActiveRehab Chiropractic & Osteopathy Centre/g, "ActiveRehab Chiropractic & Osteopathy Centre");
    content = content.replace(/ActiveRehab/g, "ActiveRehab");
    changed = true;
  }

  // Also replace any Dr. B. K. Mishra default assignments if present
  if (content.includes("Dr. Ashok P. Kota (Master of Chiropractic)")) {
    content = content.replace(/Dr\. B\. K\. Mishra \(Senior Chiropractor\)/g, "Dr. Ashok P. Kota (Master of Chiropractic)");
    changed = true;
  }

  // Also clean corrupted "" emojis to proper Namaskar greeting
  if (content.includes("")) {
    content = content.replace(/Namaskar (.*?) \?\?/g, "Namaskar $1 🙏");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("Updated brand & greeting in:", filePath);
  }
}

function traverse(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (item !== "node_modules" && item !== ".next" && item !== ".git") traverse(full);
    } else if (/\.(ts|tsx|js|json|prisma)$/.test(item)) {
      replaceInFile(full);
    }
  }
}

traverse(".");
