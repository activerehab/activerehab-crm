const fs = require("fs");
const path = require("path");

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  if (content.includes() || content.includes("Sarah Johnson")) {
    content = content.replace(/\"Dr\. Sarah Johnson, DC \(Lead Chiropractor\)\",?/g, "");
    content = content.replace(/Dr\. Sarah Johnson, DC \(Lead Chiropractor\)/g, "Senior Physiotherapy Specialist");
    content = content.replace(/Dr\. Sarah Johnson, DC/g, "ActiveRehab Specialist");
    content = content.replace(/Dr\. Sarah Johnson/g, "ActiveRehab Specialist");
    fs.writeFileSync(filePath, content, "utf8");
    console.log("Updated:", filePath);
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
console.log("Sarah Johnson removed completely.");
