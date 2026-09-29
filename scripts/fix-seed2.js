const fs = require("fs");
let code = fs.readFileSync("prisma/seed.js", "utf8");
code = code.replace("doctorName: \n          date:", "doctorName: \"Senior Physiotherapist (ActiveRehab)\",\n          date:");
fs.writeFileSync("prisma/seed.js", code, "utf8");
