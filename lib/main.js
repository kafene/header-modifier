
const {Cc, Ci} = require('chrome');
const VERBOSE = false;

let simplePrefs = require('sdk/simple-prefs');
let observerService = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);

// Get preference with valid JSON value or return null.
function getJsonPref(name) {
    var value, ret = null;

    if (simplePrefs.prefs[name]) {
        value = simplePrefs.prefs[name];

        try {
            ret = JSON.parse(value);
            VERBOSE && console.log('Got value for pref "' + name + '": ' + value);
        } catch (e) {
            console.log('Invalid JSON in preference "request"');
        }
    }

    return ret;
}

// Observe and modify HTTP requests
var httpRequestObserver = {
    observe: function (subject, topic, data) {
        if (topic !== 'http-on-modify-request') {
            return;
        }

        var headers = getJsonPref('request');
        if (!headers) {
            VERBOSE && console.log('No request headers to modify (got "' + headers + '")');
            return;
        }

        var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
        var url = (httpChannel.URI && httpChannel.URI.spec) ?
                httpChannel.URI.spec :
                null;

        if (!url || 0 !== url.indexOf('http')) {
            VERBOSE && console.log('Not modifying request headers on non-HTTP url: "' + (url || 'unknown') + '"');
            return;
        }

        for (var name in headers) {
            var msg = {
                "topic": topic,
                "name": name,
                "value": headers[name],
                "url": url,
            };

            try {
                httpChannel.setRequestHeader(name, headers[name], false);
                VERBOSE && console.log('Set request header: ' + JSON.stringify(msg));
            } catch (e) {
                msg.err = e;
                console.log('Failed to set request header' + JSON.stringify(msg));
            }
        }
    }
};

// Observe and modify HTTP responses
var httpResponseObserver = {
    observe: function (subject, topic, data) {
        if (topic !== 'http-on-examine-response') {
            return;
        }

        var headers = getJsonPref('response');
        if (!headers) {
            VERBOSE && console.log('No response headers to modify (got "' + headers + '")');
            return;
        }

        var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
        var url = (httpChannel.URI && httpChannel.URI.spec) ?
                httpChannel.URI.spec :
                null;

        if (!url || 0 !== url.indexOf('http')) {
            VERBOSE && console.log('Not modifying response headers on non-HTTP url: "' + (url || 'unknown') + '"');
            return;
        }

        for (var name in headers) {
            var msg = {
                "topic": topic,
                "name": name,
                "value": headers[name],
                "url": url,
            };

            try {
                httpChannel.setResponseHeader(name, headers[name], false);
                VERBOSE && console.log('Set response header: ' + JSON.stringify(msg));
            } catch (e) {
                msg.err = e;
                console.log('Failed to set response header' + JSON.stringify(msg));
            }
        }
    }
};


observerService.addObserver(httpRequestObserver, 'http-on-modify-request', false);
observerService.addObserver(httpResponseObserver, 'http-on-examine-response', false);
