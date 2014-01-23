/*
 * Utils
 * by kmturley
 */

/*globals window, document*/

var utils = (function () {
    'use strict';

    var module = {
        load: function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        callback(JSON.parse(xhr.responseText));
                    } else {
                        callback([{}]);
                    }
                }
            };
            xhr.send();
        }

    };
    return module;
}());