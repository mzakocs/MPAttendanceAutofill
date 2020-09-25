// Plugin Declaration
$.fn.sendkeys = function (x){
  x = x.replace(/([^{])\n/g, '$1{enter}'); // turn line feeds into explicit break insertions, but not if escaped
  return this.each( function(){
    bililiteRange(this).bounds('selection').sendkeys(x).select();
    this.focus();
  });
};

// Gets all the needed info for form filling
let firstName, lastName, studentID, currentPeriod;
chrome.storage.sync.get(["user", "currentPeriod"], function(result) {
  console.log(result)
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
  $(".quantumWizTextinputPaperinputInput").each(function(index, elem) {
    $(elem).click();
    if (index === 0) $(elem).sendkeys(firstName);
    else if (index === 1) $(elem).sendkeys(lastName);
    else if (index === 2) $(elem).sendkeys(studentID);
  });
  let inputs = document.getElementsByClassName("quantumWizTextinputPaperinputInput");
  if (inputs.length !== 3) {
    alert("This form is not compatible with MP Form Autofill!");
    return;
  }
  console.log(inputs)
  // Fills out each of them
  inputs[0].click();
  inputs[1].click();
  inputs[2].click();
  inputs[0].value = firstName;
  inputs[1].value = lastName;
  inputs[2].value = studentID;
  // Grabs all of the period select radio buttons
  let radioPeriods = document.getElementsByClassName("appsMaterialWizToggleRadiogroupEl");
  // Selects the one for the specific period and clicks it
  radioPeriods[currentPeriod].click();
  // Selects the very last radio button and clicks it (I have logged into my class today "yes")
  radioPeriods[radioPeriods.length - 1].click();
  // Finds the submit button and clicks it
  let submitButton = document.getElementsByClassName("appsMaterialWizButtonPaperbuttonLabel quantumWizButtonPaperbuttonLabel exportLabel");
  setTimeout(function() {
    submitButton[0].click();
  }, 1000)
});

