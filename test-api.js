
const API_URL = "https://resumefit-ai.461ec1cd-2487-444b-a3cb-af68de0f3279.railway.app/analyze";

async function analyzeJob(jobPost, cv) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_post: jobPost,
        cv: cv,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();

    console.log("API Response:", result);
    return result;
  } catch (error) {
    console.error("Error interacting with the API:", error);
  }
}

const jobPost = "We are looking for an experienced JavaScript developer.";
const cv = "A seasoned developer with expertise in JavaScript, Node.js, and React.";

analyzeJob(jobPost, cv)
  .then((response) => {
    if (response) {
      console.log("Suggested improvements:", response.answer);
    }
  })
  .catch((error) => {
    console.error("Error processing the request:", error);
  });
