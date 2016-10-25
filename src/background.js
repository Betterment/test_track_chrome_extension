var getConditions = function() {
    var domains = /* @exec getDomains() */;
    conditions = domains.map(function(domain) {
        return new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: '.' + domain },
            css: ['body._tt']
        })
    });
    // Enable on the filesystem
    conditions.push(
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['file'] },
            css: ['body._tt']
        })
    );
    return conditions;
};

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                // If any of these conditions match ...
                conditions: getConditions(),
                // And shows the extension's page action.
                actions: [ new chrome.declarativeContent.ShowPageAction() ]
            }
        ]);
    });
});
