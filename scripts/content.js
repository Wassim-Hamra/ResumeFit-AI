console.log('hello')
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractedData") {
    console.log(message.data);
  }
});
