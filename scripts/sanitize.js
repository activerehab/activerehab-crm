const fs = require("fs");
const path = require("path");

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const p = path.join(dir, file);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== ".git") {
        walk(p);
      }
    } else if (/\.(tsx|ts|js|json|css|prisma)$/.test(file)) {
      try {
        const buf = fs.readFileSync(p);
        // Clean utf8 without BOM
        fs.writeFileSync(p, buf.toString("utf8"), "utf8");
      } catch (e) {
        console.error("Error with file:", p, e);
      }
    }
  }
}

["app", "components", "lib", "prisma"].forEach((d) => {
  if (fs.existsSync(d)) walk(d);
});
console.log("Sanitized files successfully.");
