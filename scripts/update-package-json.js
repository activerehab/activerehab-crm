const fs = require("fs");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

pkg.scripts = {
  "dev": "next dev",
  "postinstall": "prisma generate",
  "build": "prisma generate && prisma db push && node prisma/seed.js && next build",
  "start": "next start",
  "lint": "next lint"
};

fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2), "utf8");
console.log("Updated package.json scripts with automated Prisma migration & seeding.");
