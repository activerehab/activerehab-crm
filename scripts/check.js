const fs = require("fs");
console.log("tsconfig.json:", Buffer.from(fs.readFileSync("tsconfig.json")).slice(0, 20));
console.log("app/layout.tsx:", Buffer.from(fs.readFileSync("app/layout.tsx")).slice(0, 20));
console.log("app/api/events/route.ts:", Buffer.from(fs.readFileSync("app/api/events/route.ts")).slice(0, 20));
