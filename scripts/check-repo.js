async function check() {
  const res = await fetch("https://api.github.com/repos/activerehab/activerehab-crm");
  console.log("GitHub Status Code:", res.status);
  const json = await res.json();
  console.log("GitHub Message:", json.message);
}
check();
