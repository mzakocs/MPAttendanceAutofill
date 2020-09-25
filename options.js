// AutoFill fields in the options page
chrome.storage.sync.get(["user", "class"], (result) => {
  // Starts with user info
  if (result.user !== undefined) {
    let userOptions = result.user;
    for (fieldName of Object.keys(userOptions)) {
      let field = document.getElementById(fieldName);
      field.value = userOptions[fieldName];
    }
  }
  // Then does class info
  if (result.class !== undefined) {
    let classOptions = result.class;
    for (fieldName of Object.keys(classOptions)) {
      let field = document.getElementById("period" + fieldName.toString());
      field.value = classOptions[fieldName].link;
    }
  }
});

// Save Button for User Options
let userOptionsSave = document.getElementById("userOptionsSave");
userOptionsSave.addEventListener("click", function () {
  // Grab the values of the fields
  let firstNameField = document.getElementById("firstName");
  let lastNameField = document.getElementById("lastName");
  let studentIDField = document.getElementById("studentID");
  // Stores them in sync storage
  chrome.storage.sync.set({
    user: {
      firstName: firstNameField.value,
      lastName: lastNameField.value,
      studentID: studentIDField.value,
    },
  }, function() {
    alert("Saved User Options!")    
  });
});

// Save button for class options
let classOptionsSave = document.getElementById("classOptionsSave");
classOptionsSave.addEventListener("click", function() {
  // Grab the values of the fields
  let classValues = {};
  for (let i = 0; i < 10; i++) {
    let classValue = document.getElementById("period" + i.toString()).value;
    if (classValue) {
      classValues[i] = {period_num: i, link: classValue, last_completed: null}
    }
  }
  // Stores them in sync storage
  chrome.storage.sync.set({class: classValues}, function() {
    alert("Saved Class Options!");
    console.log(classValues)
  });
});
