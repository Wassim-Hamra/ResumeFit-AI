document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get('jobDetails', function(data) {
    const jobDetails = data.jobDetails;

    if (jobDetails) {
      document.getElementById('jobTitle').innerText = jobDetails.title || 'N/A';
      document.getElementById('companyName').innerText = jobDetails.company || 'N/A';
      document.getElementById('jobDescription').innerText = jobDetails.description || 'N/A';
    }
  });
});
