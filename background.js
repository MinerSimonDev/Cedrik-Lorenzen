chrome.runtime.onInstalled.addListener(() => {
  console.log("Recipe Ingredients Extractor installed.");
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-popup") {
    chrome.action.openPopup();
  }
});
