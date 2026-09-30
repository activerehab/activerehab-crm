async function check() {
  const res = await fetch("https://api.github.com/users/activerehab");
  const json = await res.json();
  console.log("GitHub User Check:", res.status, json.login || json.message);
}
check();
