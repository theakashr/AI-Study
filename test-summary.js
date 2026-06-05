const formData = new FormData();
formData.append("prompt", "Hello");

fetch("https://ai2-drab.vercel.app/api/agents/summary", {
  method: "POST",
  body: formData
})
.then(res => res.json())
.then(data => {
  console.log(JSON.stringify(data, null, 2));
})
.catch(err => console.error(err));
