const fs = require('fs');

async function testAPIs() {
  console.log("Testing Study Planner API...");
  try {
    const plannerRes = await fetch('http://localhost:3000/api/agents/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'React', hours: 5, difficulty: 'Beginner' })
    });
    const plannerData = await plannerRes.json();
    console.log("Planner Result:", plannerRes.status, plannerData.error ? plannerData.error : "Success");
  } catch(e) { console.error("Planner Fetch failed", e); }

  console.log("Testing Quiz API...");
  try {
    const quizFormData = new FormData();
    quizFormData.append('topic', 'React');
    const quizRes = await fetch('http://localhost:3000/api/agents/quiz', {
      method: 'POST',
      body: quizFormData
    });
    const quizData = await quizRes.json();
    console.log("Quiz Result:", quizRes.status, quizData.error ? quizData.error : "Success");
  } catch(e) { console.error("Quiz Fetch failed", e); }
}

testAPIs();
