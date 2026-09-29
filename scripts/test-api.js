async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/analytics");
    const json = await res.json();
    console.log("Analytics API Response:", JSON.stringify(json, null, 2));

    const resPatients = await fetch("http://localhost:3000/api/patients");
    const jsonPatients = await resPatients.json();
    console.log("Patients API Count:", jsonPatients.data ? jsonPatients.data.length : "none");
  } catch (err) {
    console.error("Test failed:", err);
  }
}
test();
