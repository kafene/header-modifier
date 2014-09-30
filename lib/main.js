
/**
 * Modify request and response headers
 *
 * @todo - code deduplication
 */

const {Cc, Ci} = require('chrome');
const VERBOSE = true;

let simplePrefs = require('sdk/simple-prefs');
let observerService = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);

observerService.addObserver({
    observe: function (subject, topic, data) {
        if (topic !== 'http-on-examine-request') {
            return;
        }

        var headers = null;
        if (simplePrefs.prefs['request']) {
            var prefValue = simplePrefs.prefs['request'];

            try {
                headers = JSON.parse(prefValue);
                VERBOSE && console.log('Got value for preference "request": ' + prefValue);
            } catch (e) {
                VERBOSE && console.log('Invalid JSON in preference "request"');
                return;
            }
        }

        if (!headers) {
            console.log('No request headers to modify (got "' + headers + '")');
            return;
        }

        var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
        var uri = httpChannel.URI;
        var url = (uri && uri.spec) ? uri.spec : null;

        if (!url || 0 !== url.indexOf('http')) {
            VERBOSE && console.log('Not modifying request headers on non-HTTP url: "' + (url || 'unknown') + '"');
            return;
        }

        var name, value, msg;
        for (name in headers) {
            value = headers[name];
            msg = {
                "topic": topic,
                "name": name,
                "value": value,
                "url": url,
            };

            try {
                if (topic === 'http-on-examine-response') {
                    httpChannel.setResponseHeader(name, value, false);
                } else if (topic === 'http-on-examine-request') {
                    httpChannel.setRequestHeader(name, value, false);
                }

                VERBOSE && console.log('Set request header: ' + JSON.stringify(msg));
            } catch (e) {
                msg.err = e;
                VERBOSE && console.log('Failed to set request header' + JSON.stringify(msg));
            }
        }
    }
}, 'http-on-examine-request', false);

observerService.addObserver({
    observe: function (subject, topic, data) {
        if (topic !== 'http-on-examine-response') {
            return;
        }

        var headers = null;
        if (simplePrefs.prefs['response']) {
            var prefValue = simplePrefs.prefs['response'];

            try {
                headers = JSON.parse(prefValue);
                VERBOSE && console.log('Got value for preference "response": ' + prefValue);
            } catch (e) {
                VERBOSE && console.log('Invalid JSON in preference "response"');
                return;
            }
        }

        if (!headers) {
            VERBOSE && console.log('No response headers to modify (got "' + headers + '")');
            return;
        }

        var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
        var uri = httpChannel.URI;
        var url = (uri && uri.spec) ? uri.spec : null;

        if (!url || 0 !== url.indexOf('http')) {
            VERBOSE && console.log('Not modifying response headers on non-HTTP url: "' + (url || 'unknown') + '"');
            return;
        }

        var name, value, msg;
        for (name in headers) {
            value = headers[name];
            msg = {
                "topic": topic,
                "name": name,
                "value": value,
                "url": url,
            };

            try {
                httpChannel.setResponseHeader(name, value, false);
                VERBOSE && console.log('Set response header: ' + JSON.stringify(msg));
            } catch (e) {
                msg.err = e;
                VERBOSE && console.log('Failed to set response header' + JSON.stringify(msg));
            }
        }
    }
}, 'http-on-examine-response', false);