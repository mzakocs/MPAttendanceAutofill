/* FUNCTION DECLARATIONS */
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
const filloutForm = async function () {
  let { period_num, last_completed, link } = this;
  await chrome.storage.sync.get(["user"], (result) => {
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
    // Gets info on the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
      // Updates the URL on the current tab
      chrome.tabs.update(null, { url: link, active: false });
      // When the page is finished loading, inject the script
      chrome.tabs.onUpdated.addListener(function injectScript(tab, info) {
        if (info.status === "complete") {
          // Removes the listener so the script doesn't get injected twice
          chrome.tabs.onUpdated.removeListener(injectScript);
          // Injects the script into the page
          chrome.tabs.executeScript(null, { file: "jquery.js" }, function () {
            chrome.tabs.executeScript(
              null,
              { file: "bililiteRange.js" },
              function () {
                chrome.tabs.executeScript(null, { file: "fillForm.js" });
              }
            );
          });
        }
      });
    });
  });
  // Changes the icon on the popup menu
  let completedIcon = document.getElementById(`period${period_num}_icon`);
  completedIcon.className = "fa fa-check green";
};

// Opens the meeting link from a button
const openMeetingLink = async function () {
  let { period_num, link } = this;
  chrome.tabs.update(null, { url: link, active: false });
};

/* RUNNING CODE STARTS HERE */
// Sets up a control for each period that's been given
let periodsContainer = document.getElementById("periodsContainer");

// Gets each of the attendance link objects from sync storage
chrome.storage.sync.get(["class", "meeting", "alias"], (result) => {
  if (result.class !== undefined) {
    let classOptions = result.class;
    // Goes through each of the options and adds a control cluster for each in the popup
    for (periodNumber of Object.keys(classOptions)) {
      let period = classOptions[periodNumber];
      // Adds the main period control div
      let periodControl = document.createElement("div");
      let periodControlLabel = document.createElement("p");
      // Sets an alias label if there is one set
      if (result.alias && result.alias[periodNumber]) {
        periodControlLabel.innerHTML = result.alias[periodNumber];
      }
      else {
        periodControlLabel.innerHTML = "Period " + periodNumber.toString();
      }
      periodControlLabel.className = "periodLabel";
      periodControl.appendChild(periodControlLabel);
      periodControl.className = "periodControls container";
      periodsContainer.appendChild(periodControl);
      // Adds autofill button to the period control div
      let periodControlButtonPanel = document.createElement("div");
      let autoFillButton = document.createElement("button");
      let autoFillIcon = document.createElement("i");
      let completedIcon = document.createElement("i");
      // Presets it to uncompleted (red x)
      completedIcon.className = "fa fa-times red";
      completedIcon.title = "Not Completed!";
      completedIcon.id = `period${periodNumber}_icon`;
      if (period.last_completed !== undefined) {
        let lastCompleted = new Date(period?.last_completed);
        if (lastCompleted.getDate() === new Date().getDate()) {
          // Has been completed today, show a green check
          completedIcon.className = "fa fa-check green";
          completedIcon.title = "Completed!";
        }
      }
      // Does some styling on the icon and buttons
      autoFillIcon.className = "fa fa-clipboard";
      autoFillButton.title = "Auto-Fill Attendance for Period " + periodNumber;
      // Adds a click listener to the autofill button
      console.log(period);
      autoFillButton.addEventListener("click", filloutForm.bind(period));
      // Adds all of the period control buttons to the main periodControl div
      autoFillButton.appendChild(autoFillIcon);
      periodControlButtonPanel.appendChild(completedIcon);
      periodControlButtonPanel.appendChild(autoFillButton);
      periodControl.appendChild(periodControlButtonPanel);
      // Adds a meeting link to the periodControlButtonPanel if it exists
      if (
        result.meeting !== undefined &&
        result.meeting[periodNumber] !== undefined
      ) {
        let meetingLinkButton = document.createElement("button");
        let meetingLinkButtonIcon = document.createElement("i");
        meetingLinkButton.title = "Open Meeting for Period " + periodNumber;
        meetingLinkButtonIcon.className = "fa fa-tv";
        meetingLinkButton.appendChild(meetingLinkButtonIcon);
        meetingLinkButton.addEventListener(
          "click",
          openMeetingLink.bind(result.meeting[periodNumber])
        );
        periodControlButtonPanel.appendChild(meetingLinkButton);
      }
    }
    // Adds a button at the bottom of the page that fills out every form instantly
    // let allButton = document.createElement('button');
    // allButton.style.width = "80%";
    // allButton.innerText = "Fill Out Everything";
    // // Adds an event listener to the button
    // allButton.addEventListener("click", function() {
    //   chrome.storage.sync.get(["class"], async function(result) {
    //     for (period of Object.values(result.class)) {
    //       console.log(period)
    //       await filloutForm.apply(period);
    //     }
    //   });
    // });
    // document.body.appendChild(allButton);
  }
  // Adds an info section to the bottom of the page
  let infoSection = document.createElement("h5");
  infoSection.innerText =
    'To configure the extension, right-click on the MP Logo and press "Options"';
  document.body.appendChild(infoSection);
});
