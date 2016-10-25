chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.eventName == 'tt:splits:loaded') {
            draw(request.data.splitRegistry, request.data.assignmentRegistry, request.data.visitorId);
            sendResponse({});
        }
    }
);

function loadSplits() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { eventName: "tt:splits:load" }, function(response) {
        });
    });
}

function draw(splitRegistry, assignmentRegistry, visitorId) {
    var listItems = Object.keys(splitRegistry).sort().map(function(splitName) {
        var variants = splitRegistry[splitName],
            selectedVariant = assignmentRegistry[splitName];

        return listItem(
            label(splitName),
            optionList(splitName, Object.keys(variants), selectedVariant)
        );
    });

    $('.loading').hide();
    $('#form').show();
    $('#visitor').html(visitorLabel(visitorId));
    $('#splits tbody').html(listItems);
    filterTable();
}

function visitorLabel(visitor_id) {
    return $('<p>').addClass('visitor').text(visitor_id);
}

function listItem() {
    var args = Array.prototype.slice.call(arguments);
    return $('<tr>').html(args);
}

function label(html) {
    return $('<td>').html(html);
}

function optionList(split_name, variant_names, selected_variant) {
    var options = variant_names.map(function (name) {
        return option(name, name === selected_variant);
    });

    options.unshift(option('', !selected_variant));

    return label($('<select>').attr('name', split_name).html(options));
}

function option(variant_name, selected) {
    return $('<option>').attr({ 'value': variant_name, 'selected': selected }).text(variant_name);
}

function filterTable() {
    $('#splits tbody tr').show();

    var filter = $('#name-filter').val().toLowerCase();
    var rowsMissingFilter = $('#splits tbody tr').filter(function() { return $(this).text().toLowerCase().indexOf(filter) == -1;} );

    rowsMissingFilter.hide();
}

$(function() {
    loadSplits();

    $('#filter').keyup(function() {
        filterTable();
    });

    $('#save').on('click', function() {
        $('.loading').show();
        $('#form').hide();

        var splitsToSave = $('#splits select').map(function() {
            if ($(this).val()) {
                return {
                    name: $(this).attr('name'),
                    variant: $(this).val()

                };
            } else {
                return null;
            }
        }).get();

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                eventName: 'tt:splits:save',
                sharedSecret: '/* @exec getSharedSecret() */',
                splits: splitsToSave
            }, {}, function (response) {});
        });
    });
});
