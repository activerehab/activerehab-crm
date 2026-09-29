const fs = require("fs");
let code = fs.readFileSync("app/campaigns/page.tsx", "utf8");
code = code.replace("Personalized with {{patient_name}}", "Personalized with patient name");
fs.writeFileSync("app/campaigns/page.tsx", code, "utf8");
