
const API_URL = "https://b049-102-152-209-152.ngrok-free.app/analyze";

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

const jobPost = "Machine Learning Intern Hayward, CA Verdant Robotics develops AI-powered farming implements and data solutions for agriculture. Our Sharpshooter enables transformative applications across all crops and field types through the power of Verdant’s proprietary Bullseye Technology with millimeter accuracy for weeding, thinning and fertilization. As a Machine Learning Intern, you will collaborate closely with our Director of Machine Learning and the Software team. You will help us design, implement, and deploy machine learning solutions to improve the accuracy of our real-time decision making software, to automatically assess plant characteristics, and to adapt to field conditions on the fly. Our core technology empowers farmers to grow more profitable food. Together with our partners, we are building environmentally friendly, sustainable, and highly productive farms. Our office is located in Hayward, CA, about 25-30 mins average commute from most places in the Bay Area. We offer competitive pay and a great team environment. What You Will Do: Learn from the ML and Field team about the agricultural domain. Design and implement machine learning solutions for outdoor agricultural robotics, including computer vision and other machine learning applications. Take ownership from data collection and labeling to testing in the field. Collaborate with the team to design and optimize machine learning systems for outdoor agricultural robotics. Qualifications: Proficiency in Python. Hands-on experience with machine learning and real world data. Ability to understand and discuss machine learning research literature. Familiarity with C++. If you are a C++ and CUDA expert, this will open up more possibilities. Familiarity with PyTorch or other neural network library. Self-starter able to take the initiative and work independently. Exceptional responsiveness, collaboration and communication skills; ability to excel at time-sensitive tasks. Many of these skills will likely have been acquired through a Master’s or PhD in Computer Science or related field, but not exclusively. The scope of the internship will adapt to the intern’s experience level. Email Resume to careers@verdantrobotics.com Verdant Robotics provides equal employment opportunities (EEO) to all employees and applicants for employment without regard to race, color, religion, sex, national origin, age, disability, genetics, sexual orientation, gender identity, or gender expression.";
const cv = "(+216) 98786241 Tunis, Tunisia wassimhamraa@gmail.com WORK EXPERIENCE Data Science & Automation Engineer, Intern Hexabyte Wassim Hamra Portfolio Website: wassimhamra.com github.com/Wassim-Hamra linkedin.com/in/medwassimhamra/ June 2024 — July 2024 Tunisia, Ariana • Developed and deployed an optimized XGBoost model to predict churn risk, providing targeted scores for retention actions. • Developed and deployed a Tableau dashboard with 'Clients' and 'Churn' modules, enabling 5 executives to analyze client data and churn statistics. • Improved data accuracy by 62% by deploying a Python automation script via Docker, automating client subscription updates and replacing manual processes. • Saved over 2 hours daily for the commercial team by developing an email notification system for newly activated subscriptions, eliminating manual checks. Project Manager Sept 2023 — Feb 2024 Optima Junior Entreprise Tunisia, Manar • Led a team of four students to develop an e-commerce website for a Swiss beauty salon using WordPress and Figma. • Implemented the Scrum methodology during the project, conducting sprint planning, daily stand-up meetings, and maintaining a product backlog. • Led project planning, delegated tasks and responsibilities within the team, tracked project progress to ensure alignment with client expectations. Software Engineer, Intern July 2023 — Aug 2023 SIMAC Tunisia, Tunis • Contributed to the development of a feature within SIMAC ERP software that automated the generation of XML files for enterprise tax reporting, successfully implemented by 7 companies across Tunisia and Central Africa. • Utilized SQL and PL/SQL for backend operations like retrieving tax-related data from Oracle’s Databases. Used Delphi for frontend interface development. • Collaborated with senior team members to gather feature requirements and tax regulations to ensure that the XML files comply with regulatory standards. PROJECTS Multiple Disease Prediction System Web Application • Implemented predictive ML models using medical data derived from kaggle to accurately assess users’ health risks and potential diseases related to heart/diabetes/parkinson. • Designed a full stack web interface that enabled users to input their health information and receive real-time predictions. Used Python (Django) for the backend and Js / Bootstrap for the frontend. • Hosted the web app on Heroku, used GitHub and Git for version control, ensuring an end-to-end project from design to deployment. EDUCATION Diploma Of Engineering: Internet of Things (IoT) | University Of Tunis El Manar Equivalent to Bachelor’s and master’s degree Graduation: May 2027 TECHNICAL SKILLS Tools and Languages Libraries Developer Tools Python , SQL , Tableau , C/C++ , Java Pytorch , Scikit-learn , NLTK , PyCaret, Selenium , Streamlit , Django Git , Docker/Kubernetes , Bash , Linux , Anaconda , DBeaver EXTRACURRICULAR ACTIVITIES Machine Learning Team Member | Google Developers Student Club Member | IEEE Computer Society";

analyzeJob(jobPost, cv)
  .then((response) => {
    if (response) {
      console.log("Suggested improvements:", response.answer);
    }
  })
  .catch((error) => {
    console.error("Error processing the request:", error);
  });
