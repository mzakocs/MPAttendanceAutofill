// Sets up a control for each period that's been given
let periodsContainer = document.getElementById("periodsContainer");
// Function Declaration
const filloutForm = function () {
  // This grabs the user info, opens the given form, and then injects
  // the "formFillInjection" function into the google sheets page with the given params
  // Starts by getting the user info from the storage
  let { period_num, last_completed, link } = this;
  chrome.storage.sync.get(["user"], (result) => {
    if (result.user === undefined) return;
    let user = result.user;
    // Checks that everything is filled out properly
    if (!user.firstName || !user.lastName || !user.studentID) {
      alert('Fill out the "User Options" section in the extension options!');
      return;
    }
    //Opens the tab with the form
  //   chrome.tabs.create({ url: link, active: true }, (tab) => {
  //     // Sets whatever period was selected in the activePeriod data storage
  //     chrome.storage.sync.set({activePeriod: period_num}, () => {
  //       // Now that we have the period in storage, we can inject our script into google forms
          
  //         chrome.tabs.onUpdated.addListener(function() {
  //           chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //             chrome.tabs.executeScript(
  //               tabs[0].id,
  //               {code: 'document.body.style.backgroundColor = "' + "black" + '";'});
  //             });     
  //         });
  //     });  
  //         // chrome.tabs.executeScript(tab, {code: 'document.body.style.backgroundColor = "black"'}, () => {
  //         //   // Set the last active time as the current time
  //         //   // not sure how to do this yet
  //         // });
  //         // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //         //   chrome.tabs.executeScript(
  //         //       tabs[0].id,
  //         //       {code: 'document.body.style.backgroundColor = "' + "black" + '";'});
  //         // });       
  //   });
  });
};
// Gets each of the setup classes
chrome.storage.sync.get(["class"], (result) => {
  if (result.class === undefined) return;
  let classOptions = result.class;
  for (periodNumber of Object.keys(classOptions)) {
    let period = classOptions[periodNumber];
    // Adds the main period control div
    let periodControl = document.createElement("div");
    periodControl.innerHTML = "Period " + periodNumber.toString();
    periodControl.className = "periodControls container";
    periodsContainer.appendChild(periodControl);
    // Adds autofill button to the period control div
    let periodControlButtonPanel = document.createElement("div");
    let autoFillButton = document.createElement("button");
    let autoFillIcon = document.createElement("i");
    let completedIcon = document.createElement("i");
    completedIcon.className = "fa fa-times red";
    completedIcon.title = "Not Completed!";
    if (period.last_completed !== undefined) {
      let lastCompleted = new Date(period?.last_completed);
      if (lastCompleted.getDate() === new Date().getDate()) {
        // Has been completed today
        completedIcon.className = "fa fa-check green";
        completedIcon.title = "Completed!";
      }
    }
    // Does some styling on the icon and buttons
    autoFillIcon.className = "fa fa-clipboard";
    autoFillButton.title = "Auto-Fill Attendance";
    // Adds a click listener to the autofill button
    console.log(period);
    autoFillButton.addEventListener("click", filloutForm.bind(period));
    // Adds all of the period control buttons to the main periodControl div
    autoFillButton.appendChild(autoFillIcon);
    periodControlButtonPanel.appendChild(completedIcon);
    periodControlButtonPanel.appendChild(autoFillButton);
    periodControl.appendChild(periodControlButtonPanel);
  }
});
