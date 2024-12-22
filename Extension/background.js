chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes('linkedin.com/jobs/search/')) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: injectExtractionLogic
    }, (result) => {
      if (chrome.runtime.lastError) {
        console.error("Script execution failed:", chrome.runtime.lastError);
      } else {
        console.log("Script executed successfully");
      }
    });
  }
});

function injectExtractionLogic() {
  const jobTitle = document.querySelector('.t-24.t-bold.inline a') ? document.querySelector('.t-24.t-bold.inline a').innerText : '';
  const companyName = document.querySelector('.job-details-jobs-unified-top-card__company-name a') ? document.querySelector('.job-details-jobs-unified-top-card__company-name a').innerText : '';
  const jobDescription = document.querySelector('.mt4 p') ? document.querySelector('.mt4 p').innerText : '';

  const extractedText = {
    title: jobTitle,
    company: companyName,
    description: jobDescription
  };
    console.log(jobDescription)
  chrome.storage.local.set({ jobDetails: extractedText }, function() {
    console.log("Job details saved!");
  });
  const API_URL = "https://74bd-102-152-209-152.ngrok-free.app/analyze";
  const jobPost = jobDescription;
  const cv = "(+216) 98786241 Tunis, Tunisia wassimhamraa@gmail.com ...";
  async function analyzeJob(jobPost, cv) {
    try {
    console.log("Payload being sent:", {
     job_post: jobPost,
     cv: cv,
    });
      const response = await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({job_post: jobPost, cv:cv}),
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

  analyzeJob(jobPost, cv).then((response) => {
    if (response) {
      console.log("Suggested improvements:", response.answer);
    }
  }).catch((error) => {
    console.error("Error processing the request:", error);
  });

}