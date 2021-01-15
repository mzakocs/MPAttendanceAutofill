/* FUNCTION DECLARATION */
// Updates the date of a attendance auto-fill
const updateDate = function (periodNumber) {
  // Gets the old period data
  chrome.storage.sync.get(["class"], (result) => {
    let data = result.class;
    data[periodNumber].last_completed = new Date().toDateString();
    chrome.storage.sync.set({ class: data });
  });
};

// This grabs the user info, opens the given form, and then injects
// the "formFillInjection" function into the google sheets page with the given params
// Starts by getting the user info from the storage
const filloutForm = async function (period, recursiveList = []) {
  let recursiveLength = recursiveList.length;
  let isRecursive = (recursiveLength > 1);
  let { period_num, last_completed, link } = period;
  await chrome.storage.sync.get(["user", "preferences", "fillAllForms"], (result) => {
    if (result.user === undefined) return;
    let user = result.user;
    // Checks that everything is filled out properly
    if (!user.firstName || !user.lastName || !user.studentID) {
      alert('Fill out the "User Options" section in the extension options!');
      return;
    }
    // Puts the new last_completed date into this period
    updateDate(period_num);
    // Puts the current period into sync storage for use by the injected script
    chrome.storage.sync.set({ currentPeriod: period_num });
    // Checks if the "open in new tab" preference is on
    let preferences = result.preferences;
    if (preferences && preferences.openInNewTabCheckbox && !isRecursive) {
      chrome.tabs.create({ active: true, url: link });
    }
    // If its not on, just keep going in the same tab
    else {
      chrome.tabs.update(null, { url: link });
    }
    // When the page is finished loading, inject the script
    chrome.tabs.onUpdated.addListener(function injectScript(tab, info) {
      if (info.status === "complete") {
        // Removes the listener so the script doesn't get injected twice
        chrome.tabs.onUpdated.removeListener(injectScript);
        // Injects the script into the page
        chrome.tabs.executeScript(
          null,
          { file: "injectables/jquery.js" },
          function () {
            chrome.tabs.executeScript(
              null,
              { file: "injectables/bililiteRange.js" },
              function () {
                chrome.tabs.executeScript(
                  null,
                  {
                    file: "injectables/fillForm.js",
                  },
                  function () {
                    // Will repeatedly run the function until all periods are filled out
                    // This is created for the fillAll functionality of the extension
                    if (result.fillAllForms) {
                      let delay = result.fillAllForms.delay || 4;
                      // Quick check to make sure that the minimum delay is 4 seconds
                      // The original delay of 3 seconds was way too short for anybody without god-tier internet
                      if (delay < 4) {
                        delay = 4;
                      }
                      // fills the next form recursively after the given delay
                      window.setTimeout(function () {
                        if (isRecursive  && result.fillAllForms.enabled) {
                          recursiveList.forEach(function (recursivePeriod, i) {
                            if (
                              recursivePeriod === period &&
                              i != recursiveLength - 1
                            ) {
                              filloutForm(recursiveList[i + 1], recursiveList);
                            }
                          });
                        }
                      }, delay * 1000); // multiplied by 1000 to convert to milliseconds
                    }
                  }
                );
              }
            );
          }
        );
      }
    });
  });
};

// Fills out all forms at once
const filloutAllForms = async function () {
  await chrome.storage.sync.get(["class"], async function (result) {
    if (!result.class) return;
    let classes = result.class;
    filloutForm(classes[1], Object.values(classes));
  });
};

// Opens the meeting link from a button
const openMeetingLink = async function (meeting) {
  let { period_num, link } = meeting;
  // Checks if the "open in new tab" preference is on
  await chrome.storage.sync.get(["preferences", "gmcu"], (result) => {
    // Check if the google meets code utility is on, if so, start the process
    if (
      result.gmcu?.base_link &&
      !link.includes("www") &&
      !link.includes("//") &&
      !link.includes(".com")
    ) {
      // Put this code into the GMCU storage
      chrome.storage.sync.set({
        gmcu: { base_link: result.gmcu.base_link, current_code: link },
      });
      // Starts the GMCU script injection process
      gmcuInjection();
    }
    // If theres no gmcu in use, check if "open in new tab" is on
    else if (result.preferences && result.preferences.openInNewTabCheckbox) {
      chrome.tabs.create({ active: true, url: link });
    }
    // If the option is on, open it in the current tab
    else {
      chrome.tabs.update(null, { url: link, active: true });
    }
  });
};

// Google Meets Code Utility injection process
const gmcuInjection = async function () {
  chrome.storage.sync.get(["gmcu", "preferences"], function (result) {
    let preferences = result.preferences;
    let gmcu = result.gmcu;
    console.log(gmcu);
    if (!gmcu || !gmcu.base_link) return;
    // Starts by opening the base link related set for the GMCU
    if (preferences && preferences.openInNewTabCheckbox) {
      chrome.tabs.create({ active: true, url: gmcu.base_link });
    }
    // If the option is on, open it in the current tab
    else {
      chrome.tabs.update(null, { url: gmcu.base_link, active: true });
    }
    // When the page is finished loading, inject the script
    chrome.tabs.onUpdated.addListener(function injectScript(tab, info) {
      if (info.status === "complete") {
        // Removes the listener so the script doesn't get injected twice
        chrome.tabs.onUpdated.removeListener(injectScript);
        // Injects the script into the page
        chrome.tabs.executeScript(
          null,
          { file: "injectables/jquery.js" },
          function () {
            chrome.tabs.executeScript(
              null,
              { file: "injectables/bililiteRange.js" },
              function () {
                chrome.tabs.executeScript(
                  null,
                  {
                    file: "injectables/fillGMCU.js",
                  }
                );
              }
            );
          }
        );
      }
    });
  });
};

/* RUNNING CODE STARTS HERE */
// Allows popup.js to run methods in the background, mainly important injection tasks
chrome.extension.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (!msg || !msg.includes("{")) return false;
    let json = JSON.parse(msg);
    switch (json.type) {
      case "fillForm":
        filloutForm(json.period);
        break;
      case "fillAllForms":
        filloutAllForms();
        break;
      case "openMeeting":
        openMeetingLink(json.meeting);
        break;
    }
    port.postMessage("success");
  });
});
