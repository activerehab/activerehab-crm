async function inspect() {
  try {
    const res = await fetch("https://activerehab-crm.onrender.com/api/analytics");
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}
inspect();
