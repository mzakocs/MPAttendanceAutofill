// Plugin Declaration
$.fn.sendkeys = function (x) {
  x = x.replace(/([^{])\n/g, "$1{enter}"); // turn line feeds into explicit break insertions, but not if escaped
  return this.each(function () {
    bililiteRange(this).bounds("selection").sendkeys(x).select();
    this.focus();
  });
};

// Starts by grabbing the gmcu information
chrome.storage.sync.get(["gmcu"], function (result) {
  window.setTimeout(function () {
    // Finds the code input box and inputs the code
    let codeInput = $("[placeholder='Enter a code or nickname']")[0];
    $(codeInput).sendkeys(result.gmcu.current_code);
    window.setTimeout(function () {
      // Finds the final submit button
      let finalButton = $("span:contains('Join')")[0];
      console.log(finalButton);
      // Clicks it to open the meeting
      finalButton.click();
    }, 200);
  }, 200);
});
