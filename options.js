// Test info filling
let fillFormInfoButton = document.getElementById("fillFormInfo");
fillFormInfoButton.addEventListener("click", () => {
  // Fills user storage with fake user info
  chrome.storage.sync.set(
    {
      user: { firstName: "Mitch", lastName: "Zakocs", studentID: "S21500853" },
    },
    () => {
      // Fills form info with fake user info
      chrome.storage.sync.set(
        {
          class: {
            1: {
              period_num: 1,
              link:
                "https://docs.google.com/forms/d/e/1FAIpQLSe_3nar9tNZfusj_3qU4ujEX6_3DD5oRd6e2Vk5lTmrzV6Y-g/viewform?usp=sf_link",
              last_completed: "Thu Sep 23 2020",
            },
            2: {
              period_num: 2,
              link:
                "https://docs.google.com/forms/d/e/1FAIpQLSe_3nar9tNZfusj_3qU4ujEX6_3DD5oRd6e2Vk5lTmrzV6Y-g/viewform?usp=sf_link",
              last_completed: "Thu Sep 24 2020",
            },
          },
        },
        () => {
          // Gets the info
          chrome.storage.sync.get(["user", "class"], (result) => {
            console.log(result);
          });
        }
      );
    }
  );
});

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
    console.log(classOptions)
    for (fieldName of Object.keys(classOptions)) {
      let field = document.getElementById("period" + fieldName.toString());
      field.value = classOptions[fieldName].link;
    }
  }
});
