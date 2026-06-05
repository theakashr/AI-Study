const formData = new FormData();
formData.append("topic", "History");

fetch("https://ai2-drab.vercel.app/api/agents/quiz", {
  method: "POST",
  body: formData
})
.then(res => res.json())
.then(data => {
  if (data.error) {
    console.error("API Error:", data.error);
  } else if (data.quiz) {
    console.log("Success! Array length:", data.quiz.length);
  } else {
    console.log("Unknown response:", data);
  }
})
.catch(err => console.error(err));
