import * as pdfjs from '../libs/pdf.mjs';
pdfjs.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('../libs/pdf.worker.mjs');

function checkCvInStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['cv'], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.cv);
            }
        });
    });
}

function setStorage(key, value) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [key]: value }, function() {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}

async function getContent(src) {
    const doc = await pdfjs.getDocument(src).promise;
    const page = await doc.getPage(1);
    return await page.getTextContent();
}

async function getItems(src) {
    const content = await getContent(src);
    const items = content.items.map((item) => {
        return item.str;
    });
    return items;
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const cv = await checkCvInStorage();

        const popupContainer = document.getElementById("popup-container");

        if (popupContainer) {
            if (cv) {
                window.location.href = chrome.runtime.getURL('popup/success.html');
            } else {
                popupContainer.style.display = 'block';
            }
        } else {
            console.error("popup-container element not found in the DOM");
        }

    } catch (error) {
        console.error("Error checking CV in storage:", error);
    }
});

document.getElementById("read-file-btn").addEventListener("click", async () => {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = async function(event) {
            const arrayBuffer = event.target.result;
            const items = await getItems(arrayBuffer);
            const cv = items.join(' ');

            try {
                await setStorage("cv", cv);
                console.log("CV is registered");
                window.location.href = chrome.runtime.getURL('popup/success.html');
            } catch (error) {
                console.error("Error saving CV:", error);
            }
        };

        reader.readAsArrayBuffer(file);
    } else {
        alert("Please select a file.");
    }
});
