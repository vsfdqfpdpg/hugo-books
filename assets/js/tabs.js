function switchTab(tabGroup, tabId) {
    allTabItems = jQuery("[data-tab-group='" + tabGroup + "']");
    targetTabItems = jQuery("[data-tab-group='" + tabGroup + "'][data-tab-item='" + tabId + "']");

    // if event is undefined then switchTab was called from restoreTabSelection
    // so it's not a button event and we don't need to safe the selction or
    // prevent page jump
    var isButtonEvent = event != undefined;

    if (isButtonEvent) {
        // save button position relative to viewport
        var yposButton = event.target.getBoundingClientRect().top;
    }

    allTabItems.removeClass("active");
    targetTabItems.addClass("active");

    if (isButtonEvent) {
        // reset screen to the same position relative to clicked button to prevent page jump
        var yposButtonDiff = event.target.getBoundingClientRect().top - yposButton;
        window.scrollTo(window.scrollX, window.scrollY + yposButtonDiff);

        // Store the selection to make it persistent
        if (window.localStorage) {
            var selectionsJSON = window.localStorage.getItem("tabSelections");
            if (selectionsJSON) {
                var tabSelections = JSON.parse(selectionsJSON);
            } else {
                var tabSelections = {};
            }
            tabSelections[tabGroup] = tabId;
            window.localStorage.setItem("tabSelections", JSON.stringify(tabSelections));
        }
    }
}

function restoreTabSelections() {
    if (window.localStorage) {
        var selectionsJSON = window.localStorage.getItem("tabSelections");
        if (selectionsJSON) {
            var tabSelections = JSON.parse(selectionsJSON);
        } else {
            var tabSelections = {};
        }
        Object.keys(tabSelections).forEach(function (tabGroup) {
            var tabItem = tabSelections[tabGroup];
            switchTab(tabGroup, tabItem);
        });
    }
}

jQuery(document).ready(function () {
    restoreTabSelections();
});