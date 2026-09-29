const fs = require("fs");
const path = require("path");

function cleanFile(filePath) {
  let buf = fs.readFileSync(filePath);
  if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    buf = buf.slice(3);
    fs.writeFileSync(filePath, buf);
    console.log("Stripped BOM from:", filePath);
  }
}

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (item !== "node_modules" && item !== ".next" && item !== ".git") {
        walk(p);
      }
    } else {
      cleanFile(p);
    }
  }
}

walk(".");
