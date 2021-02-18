// Plugin Declaration
$.fn.sendkeys = function(x) {
  x = x.replace(/([^{])\n/g, "$1{enter}"); // turn line feeds into explicit break insertions, but not if escaped
  return this.each(function () {
    bililiteRange(this).bounds("selection").sendkeys(x).select();
    this.focus();
  });
};

// Gets all the needed info for form filling
let firstName, lastName, studentID, currentPeriod;
chrome.storage.sync.get(
  ["user", "currentPeriod", "preferences", "fillAllForms"],
  function(result) {
    if (result.user === undefined || result.currentPeriod === undefined) return;
    let user = result.user;
    firstName = user.firstName;
    lastName = user.lastName;
    studentID = user.studentID;
    currentPeriod = result.currentPeriod;
    // Finds the input fields and fills them
    // Had to use some crazy JQuery workaround because of how Google Forms
    // handles inputs. They don't use the value field on the input tag, so
    // I had to find a way to simulate input with bililiteRange
    $(".quantumWizTextinputPaperinputInput").each(function (index, elem) {
      if (index === 0) $(elem).sendkeys(firstName);
      else if (index === 1) $(elem).sendkeys(lastName);
      else if (index === 2) $(elem).sendkeys(studentID);
    });
    let inputs = document.getElementsByClassName(
      "quantumWizTextinputPaperinputInput"
    );
    if (inputs.length !== 3) {
      alert("This form is not compatible with MP Form Autofill!");
      return;
    }
    // Fills out each of them
    inputs[0].click();
    inputs[1].click();
    inputs[2].click();
    inputs[0].value = firstName;
    inputs[1].value = lastName;
    inputs[2].value = studentID;
    // Grabs all of the period select radio buttons
    let radioPeriods = Array.from(document.getElementsByClassName(
      "docssharedWizToggleLabeledContent"
    ));
    setTimeout(function() {
      // Finds the current period in the radioPeriods Array
      for (let i = 0; i < radioPeriods.length; i++) {
        // Radio button at the current index
        let currentRadio = radioPeriods[i];
        // Grabs label text for the given radio button
        let radioLabelText = currentRadio.children[0].children[0].innerText;
        // Checks if the period label matches the current period, also checks for "Zero Period"
        if (radioLabelText.includes(currentPeriod.toString()) || (radioLabelText.includes("Zero") && currentPeriod == 0)) {
          console.log("Found Radio Button: %o", currentRadio);
          currentRadio.click();
          break;
        }
      }
      // Finds the "Yes" radio button that indicates that you signed into class today
      for (let i = (radioPeriods.length - 1); i >= 0; i--) {
        // Radio button at the current index
        let currentRadio = radioPeriods[i];
        // Grabs label text for the given radio button
        let radioLabelText = currentRadio.children[0].children[0].innerText;
        // Checks for yes text in radio button label and clicks it if it exists
        if (radioLabelText.includes("Yes")) {
          console.log("Found Yes Button: %o", currentRadio)
          currentRadio.click();
          break;
        }
      }
      if (
        !result.preferences ||
        !result.preferences.noAutoSubmitCheckbox ||
        result.fillAllForms?.enabled
      ) {
        setTimeout(function() {
          // Grabs the submit button and clicks it
          let submitButton = document.getElementsByClassName(
            "appsMaterialWizButtonPaperbuttonLabel quantumWizButtonPaperbuttonLabel exportLabel"
          );
          submitButton[0].click();
        }, 600);
      }
    }, 300);
  }
);