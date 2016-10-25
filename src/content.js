function splitsLoaded(e) {
    chrome.runtime.sendMessage({ eventName: 'tt:splits:loaded', data: e.detail }, function(response) {
    });
}

function setupWindowListener() {
    window.removeEventListener('tt:splits:loaded', splitsLoaded);
    window.addEventListener('tt:splits:loaded', splitsLoaded);
}

function initialize() {
    window.removeEventListener('tt:class:added', initialize);

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {

            if (request.eventName == 'tt:splits:load') {
                setupWindowListener();
                window.dispatchEvent(new CustomEvent('tt:splits:load', {}));
                sendResponse({});

            } else if (request.eventName == 'tt:splits:save') {
                window.dispatchEvent(new CustomEvent('tt:splits:save', { detail: { sharedSecret: request.sharedSecret, splits: request.splits } }));
                sendResponse({});
            }
        }
    );

    setupWindowListener();

    var s = document.createElement('script');
    s.src = chrome.extension.getURL('eventBus.js');
    (document.head||document.documentElement).appendChild(s);
    s.onload = function() {
        s.parentNode.removeChild(s);
    };
}

if (document.getElementsByClassName('_tt').length > 0) {
    initialize();
} else {
    window.addEventListener('tt:class:added', initialize);
}
