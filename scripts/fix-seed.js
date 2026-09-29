const fs = require("fs");
let code = fs.readFileSync("prisma/seed.js", "utf8");
code = code.replace("assignedDoctor: \n      packageName:", "assignedDoctor: \"Senior Physiotherapist (ActiveRehab)\",\n      packageName:");
code = code.replace("doctorName: ActiveRehab Specialist", "doctorName: \"Dr. Ashok P. Kota (Master of Chiropractic)\"");
fs.writeFileSync("prisma/seed.js", code, "utf8");
