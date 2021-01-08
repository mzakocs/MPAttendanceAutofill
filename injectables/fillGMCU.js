// Starts by grabbing the gmcu information
chrome.storage.sync.get(["gmcu"], function(result) {
    window.setTimeout(function() {
        // Grabs the meeting start button
        let meetingStartButtons = $("div:contains('Join or start a meeting')");
        let meetingStartButton = meetingStartButtons[meetingStartButtons.length - 1];
        // Clicks the button to open the code input dialog
        meetingStartButton.click();
        window.setTimeout(function() {
            // Finds the code input box and inputs the code
            let codeInput = $("input")[0];
            codeInput.value = result.gmcu.current_code;
            window.setTimeout(function() {
                // Finds the final submit button
                let finalButton = $("span:contains('Continue')")[1];
                finalButton.click();
            }, 200);
        }, 200);
    }, 200);
});
