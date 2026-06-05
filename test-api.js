const formData = new FormData();
formData.append("topic", "Math");

fetch("http://localhost:3000/api/agents/quiz", {
  method: "POST",
  body: formData
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
