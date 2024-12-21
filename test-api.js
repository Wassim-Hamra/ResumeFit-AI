
// Define the API endpoint
const API_URL = "https://your-api-url-on-railway.app/analyze";

// Function to call the API
async function analyzeJob(jobPost, cv) {
  try {
    // Send a POST request to the API
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

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the JSON response
    const result = await response.json();

    // Log the result to the console
    console.log("API Response:", result);
    return result;
  } catch (error) {
    // Log any errors
    console.error("Error interacting with the API:", error);
  }
}

// Example usage
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
