
const API_URL = "https://railway.com/project/461ec1cd-2487-444b-a3cb-af68de0f3279/service/6bc1748f-6731-4114-9fe3-275b9495797e?environmentId=aa8dfc91-d1c4-4e82-ae6f-e9cf136f9f04&id=9cd39cb6-b778-4aee-a67c-b40a1b520792/analyze";

async function analyzeJob(jobPost, cv) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_post: "We are looking for an experienced JavaScript developer.",
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
