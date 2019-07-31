chrome.browserAction.onClicked.addListener((tab) => {
  chrome.windows.getCurrent({}, (currentWindow) => {
    // TODO: Make the coordinates approximately match the active tab.
    const top = currentWindow.top;
    const left = currentWindow.left;
    const height = currentWindow.height;
    const width = currentWindow.width;
    chrome.tabs.captureVisibleTab(currentWindow.id, {format: 'jpeg'},
        (dataUrl) => {
          chrome.windows.create({
            // TODO: Change the page.html to an actually served HTTP(S) page.
            // Seemingly impossible to inject content script into an actual
            // extension page.
            url: 'page.html', type: 'popup'
          }, (createdWindow) => {
            console.log(`array of tabs in newly created popup: ${JSON.stringify(
              createdWindow.tabs, null, 4)}`);
            chrome.tabs.executeScript(createdWindow.tabs[0].id, {code: `
              window.addEventListener('DOMContentLoaded', () => {
                document.querySelector('img').src = "${dataUrl}";
              });
            `}, (result) => {
              console.log(`result of executeScript callback: ${result}`);
            });
          });
        });
  });
  console.log(`active tab: ${JSON.stringify(tab, null, 4)}`);
  // chrome.tabs.query({'active': true}, (tabs) => {
  //   console.log(`${JSON.stringify(tabs, null, 4)}`);
  //   console.log('in chrome tabs query callback');
  //   console.log(`tab parameter from browserAction onClicked has id ${tab.id}.`);
  //   console.log(`activeTab has id ${tabs[0].id}`);
  // });
});