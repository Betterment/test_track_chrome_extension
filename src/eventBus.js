(function() {
    var TestTrack;

    function loadSplitsAndNotify() {
        TestTrack._crx.loadInfo().then(function(info) {
            window.dispatchEvent(new CustomEvent('tt:splits:loaded', {
                detail: info
            }));
        });
    }

    function saveSplits(splits, sharedSecret) {
        var promises = splits.map(function(split) {
            return split && TestTrack._crx.persistAssignment(split.name, split.variant, 'crx', sharedSecret);
        });

        // TODO: find a way to remove usage of jQuery
        $.when.apply($, promises).done(function() {
            location.reload();
        });
    }

    function init(e) {
        window.removeEventListener('tt:lib:loaded', init);
        TestTrack = e.detail.TestTrack;
        loadSplitsAndNotify();
    }

    window.addEventListener('tt:splits:load', function(e) {
        loadSplitsAndNotify();
    });

    window.addEventListener('tt:splits:save', function(e) {
        saveSplits(e.detail.splits, e.detail.sharedSecret);
    });

    // **** The order of these two lines is important, they support 2 different cases:
    // in the case where 'tt:lib:loaded' has not been triggered, we listen for it and triggering 'tt:listener:ready' will have no effect
    // in the case where 'tt:lib:loaded' has been triggered and we missed it, we trigger 'tt:listener:ready' to tell TestTrack to re-trigger 'tt:lib:loaded'
    window.addEventListener('tt:lib:loaded', init);
    window.dispatchEvent(new CustomEvent('tt:listener:ready'), {});
})();
