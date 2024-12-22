chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    if (tab.url.includes('linkedin.com/jobs/search/')) {
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
  }
});

function injectExtractionLogic() {
  const jobTitle = document.querySelector('.t-24.t-bold.inline a') ? document.querySelector('.t-24.t-bold.inline a').innerText : '';
  console.log(jobTitle)
  const companyName = document.querySelector('.job-details-jobs-unified-top-card__company-name a') ? document.querySelector('.job-details-jobs-unified-top-card__company-name a').innerText : '';
  console.log(companyName)
  const jobDescription = document.querySelector('.mt4 p') ? document.querySelector('.mt4 p').innerText : '';
  console.log(jobDescription)
  const extractedText = {
    title: jobTitle,
    company: companyName,
    description: jobDescription
  };
  console.log("Ready")
    const API_URL = "https://b6fd-102-152-209-152.ngrok-free.app/analyze";

  const jobPost = jobDescription
  const cv = "(+216) 98786241 Tunis, Tunisia wassimhamraa@gmail.com WORK EXPERIENCE Data Science & Automation Engineer, Intern Hexabyte Wassim Hamra Portfolio Website: wassimhamra.com github.com/Wassim-Hamra linkedin.com/in/medwassimhamra/ June 2024 — July 2024 Tunisia, Ariana • Developed and deployed an optimized XGBoost model to predict churn risk, providing targeted scores for retention actions. • Developed and deployed a Tableau dashboard with 'Clients' and 'Churn' modules, enabling 5 executives to analyze client data and churn statistics. • Improved data accuracy by 62% by deploying a Python automation script via Docker, automating client subscription updates and replacing manual processes. • Saved over 2 hours daily for the commercial team by developing an email notification system for newly activated subscriptions, eliminating manual checks. Project Manager Sept 2023 — Feb 2024 Optima Junior Entreprise Tunisia, Manar • Led a team of four students to develop an e-commerce website for a Swiss beauty salon using WordPress and Figma. • Implemented the Scrum methodology during the project, conducting sprint planning, daily stand-up meetings, and maintaining a product backlog. • Led project planning, delegated tasks and responsibilities within the team, tracked project progress to ensure alignment with client expectations. Software Engineer, Intern July 2023 — Aug 2023 SIMAC Tunisia, Tunis • Contributed to the development of a feature within SIMAC ERP software that automated the generation of XML files for enterprise tax reporting, successfully implemented by 7 companies across Tunisia and Central Africa. • Utilized SQL and PL/SQL for backend operations like retrieving tax-related data from Oracle’s Databases. Used Delphi for frontend interface development. • Collaborated with senior team members to gather feature requirements and tax regulations to ensure that the XML files comply with regulatory standards. PROJECTS Multiple Disease Prediction System Web Application • Implemented predictive ML models using medical data derived from kaggle to accurately assess users’ health risks and potential diseases related to heart/diabetes/parkinson. • Designed a full stack web interface that enabled users to input their health information and receive real-time predictions. Used Python (Django) for the backend and Js / Bootstrap for the frontend. • Hosted the web app on Heroku, used GitHub and Git for version control, ensuring an end-to-end project from design to deployment. EDUCATION Diploma Of Engineering: Internet of Things (IoT) | University Of Tunis El Manar Equivalent to Bachelor’s and master’s degree Graduation: May 2027 TECHNICAL SKILLS Tools and Languages Libraries Developer Tools Python , SQL , Tableau , C/C++ , Java Pytorch , Scikit-learn , NLTK , PyCaret, Selenium , Streamlit , Django Git , Docker/Kubernetes , Bash , Linux , Anaconda , DBeaver EXTRACURRICULAR ACTIVITIES Machine Learning Team Member | Google Developers Student Club Member | IEEE Computer Society";
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
        console.log(response.answer)

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
  })
  .catch((error) => {
    console.error("Error processing the request:", error);
  });

}

