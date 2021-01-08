// TODO: Create a settings page for the "fill out everything button." Have a simple explanation saying this is in beta, you should be patient when using it, and explain the delay setting. The button should be off by default.
// TODO: Make it so that when you do the "fill out everything button" that it doesn't open each form in a new tab. Also ignore the auto submit settings option if its on.
// AutoFill fields in the options page
chrome.storage.sync.get(
  ["user", "class", "meeting", "alias", "gmcu", "preferences", "fillAllForms"],
  (result) => {
    // Starts with user info
    if (result.user !== undefined) {
      let userOptions = result.user;
      for (fieldName of Object.keys(userOptions)) {
        let field = document.getElementById(fieldName);
        field.value = userOptions[fieldName];
      }
    }
    // Fills out the attendance links
    if (result.class !== undefined) {
      let classOptions = result.class;
      for (fieldName of Object.keys(classOptions)) {
        let field = document.getElementById(
          `period${fieldName.toString()}_attendance`
        );
        field.value = classOptions[fieldName].link;
      }
    }
    // Fills out the meeting links
    if (result.meeting !== undefined) {
      let meetingOptions = result.meeting;
      for (fieldName of Object.keys(meetingOptions)) {
        let field = document.getElementById(
          `period${fieldName.toString()}_meeting`
        );
        field.value = meetingOptions[fieldName].link;
      }
    }
    // Fills out generic preferences
    if (result.preferences !== undefined) {
      let genericPreferences = result.preferences;
      for (preference of Object.keys(genericPreferences)) {
        let field = document.getElementById(preference);
        field.checked = genericPreferences[preference];
      }
    }
    // Fills out the aliases
    if (result.alias !== undefined) {
      let aliasOptions = result.alias;
      for (aliasNum of Object.keys(aliasOptions)) {
        let field = document.getElementById(
          `period${aliasNum.toString()}_alias`
        );
        field.value = aliasOptions[aliasNum];
      }
    }
    // Fills out the Fill All Forms section
    if (result.fillAllForms !== undefined) {
      let fafOptions = result.fillAllForms;
      let fillAllFormsEnabledField = document.getElementById("fillAllFormsEnabled");
      fillAllFormsEnabledField.checked = fafOptions.enabled;
      let fillAllFormsChangeDelayField = document.getElementById("fillAllFormsChangeDelay");
      fillAllFormsChangeDelayField.value = fafOptions.delay;
    }
    // Fills out the Google Meets Code Utility section
    if (result.gmcu !== undefined) {
      let gmcuLink = result.gmcu.base_link;
      let field = document.getElementById("googleMeetBaseLink");
      field.value = gmcuLink;
    }
  }
);

// Save Button for User Options
let userOptionsSave = document.getElementById("userOptionsSave");
userOptionsSave.addEventListener("click", function () {
  // Grab the values of the fields
  let firstNameField = document.getElementById("firstName");
  let lastNameField = document.getElementById("lastName");
  let studentIDField = document.getElementById("studentID");
  // Stores them in sync storage
  chrome.storage.sync.set(
    {
      user: {
        firstName: firstNameField.value,
        lastName: lastNameField.value,
        studentID: studentIDField.value,
      },
    },
    function () {
      alert("Saved User Options!");
    }
  );
});

// Save Button for Attendance Link Options
let attendanceLinkSave = document.getElementById("attendanceLinkSave");
attendanceLinkSave.addEventListener("click", function () {
  // Grab the values of the attendance link fields
  let attendanceValues = {};
  for (let i = 0; i <= 10; i++) {
    let attendanceValue = document.getElementById(
      `period${i.toString()}_attendance`
    ).value;
    if (attendanceValue) {
      attendanceValues[i] = {
        period_num: i,
        link: attendanceValue,
        last_completed: null,
      };
    }
  }
  // Stores them in sync storage
  chrome.storage.sync.set({ class: attendanceValues }, function () {
    alert("Saved Attendance Link Options!");
  });
});

// Save Button for Meeting Link Options
let meetingLinkSave = document.getElementById("meetingLinkSave");
meetingLinkSave.addEventListener("click", function () {
  // Grab the values of the meeting link fields
  let meetingValues = {};
  for (let i = 0; i <= 10; i++) {
    let meetingValue = document.getElementById(`period${i.toString()}_meeting`)
      .value;
    if (meetingValue) {
      meetingValues[i] = { period_num: i, link: meetingValue };
    }
  }
  // Stores them in sync storage
  chrome.storage.sync.set({ meeting: meetingValues }, function () {
    alert("Saved Meeting Link Options!");
  });
});

// Save Button for Generic Preferences
let preferenceSave = document.getElementById("preferenceSave");
preferenceSave.addEventListener("click", function () {
  // Grab the values of the alias fields
  let preferenceValues = {};
  // Gets the values from the checkboxes
  preferenceValues.openInNewTabCheckbox = document.getElementById(
    "openInNewTabCheckbox"
  ).checked;
  preferenceValues.noAutoSubmitCheckbox = document.getElementById(
    "noAutoSubmitCheckbox"
  ).checked;
  // Stores them in sync storage
  chrome.storage.sync.set({ preferences: preferenceValues }, function () {
    alert("Saved Generic Preferences!");
  });
});

// Save Button for Class Aliases
let aliasSave = document.getElementById("aliasSave");
aliasSave.addEventListener("click", function () {
  // Grab the values of the alias fields
  let aliasValues = {};
  for (let i = 0; i <= 10; i++) {
    let aliasValue = document.getElementById(`period${i.toString()}_alias`)
      .value;
    if (aliasValue) {
      aliasValues[i] = aliasValue;
    }
  }
  // Stores them in sync storage
  chrome.storage.sync.set({ alias: aliasValues }, function () {
    alert("Saved Class Alias Options!");
  });
});

// Save Button for Fill All Forms Configuration
let fillAllFormsSave = document.getElementById("fillAllFormsSave");
fillAllFormsSave.addEventListener("click", function () {
  // Grab the values of gmcu field
  let fillAllFormsEnabled = document.getElementById("fillAllFormsEnabled").checked;
  let delayValue = document.getElementById("fillAllFormsChangeDelay").value;
  // Stores them in sync storage
  chrome.storage.sync.set(
    { fillAllForms: { enabled: fillAllFormsEnabled, delay: delayValue } },
    function () {
      alert("Saved the Fill All Forms Settings!");
    }
  );
});

// Save Button for Google Meets Code Utility
let gmcuSave = document.getElementById("gmcuSave");
gmcuSave.addEventListener("click", function () {
  // Grab the values of gmcu field
  let gmcuField = document.getElementById("googleMeetBaseLink");
  let gmcuFieldValue = gmcuField.value;
  // Stores them in sync storage
  if (gmcuFieldValue.includes("meet.google.com") || gmcuFieldValue == "") {
    chrome.storage.sync.set(
      { gmcu: { base_link: gmcuFieldValue, current_code: null } },
      function () {
        alert("Saved GMCU Settings!");
      }
    );
  } else {
    alert(
      "Not a Valid Google Meets Base Link! Please enter a URL that has a base URL of meet.google.com."
    );
  }
});

// Sets up the accordions for advanced options
let accordions = document.getElementsByClassName("accordion");
for (let i = 0; i < accordions.length; i++) {
  accordions[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    // Hides or un-hides the accordion
    if (panel.style.display === "flex") {
      panel.style.display = "none";
    } else {
      panel.style.display = "flex";
    }
  });
}

// Sets up the range input value display
let rangeInput = document.getElementById("fillAllFormsChangeDelay");
let delayIndicator = document.getElementById("delayIndicator");
rangeInput.oninput = function () {
  delayIndicator.innerHTML = `Page Change Delay (${this.value}s):`
};
