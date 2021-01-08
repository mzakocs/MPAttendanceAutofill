/* FUNCTION DECLARATIONS */
// Sends a command to background.js to auto-fill a specific attendance form
const sendFilloutCommand = function () {
  let period = this;
  // Opens a connection with background.js
  let port = chrome.extension.connect({
    name: "background_connection",
  });
  // Creates a text JSON for transmission to the background
  let jsonText = JSON.stringify({ type: "fillForm", period: period });
  // Sends the JSON command through the port
  port.postMessage(jsonText);
  // Changes the icon on the popup menu
  let completedIcon = document.getElementById(
    `period${period.period_num}_icon`
  );
  completedIcon.className = "fa fa-check green";
};

// Sends a command to background.js to auto-fill all attendance forms
const sendFilloutAllCommand = function () {
  // Opens a connection with background.js
  let port = chrome.extension.connect({
    name: "background_connection",
  });
  // Creates a text JSON for transmission to the background
  let jsonText = JSON.stringify({ type: "fillAllForms" });
  // Sends the JSON command through the port
  port.postMessage(jsonText);
  // Changes the icon on the popup menu
};

// Sends a command to background.js to open a specific meeting link
const sendMeetingOpenCommand = function () {
  let meeting = this;
  // Opens a connection with background.js
  let port = chrome.extension.connect({
    name: "background_connection",
  });
  // Creates a text JSON for transmission to the background
  let jsonText = JSON.stringify({ type: "openMeeting", meeting: meeting });
  // Sends the JSON command through the port
  port.postMessage(jsonText);
};

// Sets up a control for each period that's been given
let periodsContainer = document.getElementById("periodsContainer");
// Gets each of the attendance link objects from sync storage
chrome.storage.sync.get(["class", "meeting", "alias", "fillAllForms"], (result) => {
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
      } else {
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
      autoFillButton.addEventListener("click", sendFilloutCommand.bind(period));
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
          sendMeetingOpenCommand.bind(result.meeting[periodNumber])
        );
        periodControlButtonPanel.appendChild(meetingLinkButton);
      }
    }
    // Adds a button at the bottom of the page that fills out every form instantly
    if (result.fillAllForms && result.fillAllForms.enabled) {
      let allButton = document.createElement("button");
      allButton.style.width = "85%";
      allButton.innerText = "Fill All Forms";
      // Adds an event listener to the button
      allButton.addEventListener("click", sendFilloutAllCommand);
      document.body.appendChild(allButton);
    }
  }
  // Adds an info section to the bottom of the page
  let infoSection = document.createElement("h5");
  infoSection.innerText =
    'To configure the extension, right-click on the MP Logo and press "Options"';
  document.body.appendChild(infoSection);
});

