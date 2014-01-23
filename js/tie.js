/*
 * Tie v0.1
 * by kmturley
 */

/*globals window, document*/

var tie = (function () {
    'use strict';

    var module = {
        attrib: 'data-tie',
        init: function (data, id) {
            // get element by id otherwise use the document body
            if (id) {
                this.setup(data, document.getElementById(id).getElementsByTagName('*'));
            } else {
                this.setup(data, document.getElementsByTagName('*'));
            }
        },
        setup: function (data, items) {
            var i = 0,
                j = 0,
                key = '',
                match = {},
                type = '',
                list = null,
                nodekey = '',
                node = false;
            
            // loop through the items and check if they have the data attribute
            for (i = 0; i < items.length; i += 1) {
                if (items[i].hasAttribute(this.attrib) && items[i] !== document.body) {
                    key = items[i].getAttribute(this.attrib);
                    match = this.find(key, data);
                    type = Object.prototype.toString.call(match.value);
                    
                    // if the data attribute is an array, loop through and duplicate the dom template
                    if (type === '[object Array]') {
                        list = document.createDocumentFragment();
                        nodekey = items[i].firstElementChild.getAttribute(this.attrib);
                        node = false;
                        for (j = 0; j < match.value.length; j += 1) {
                            node = items[i].firstElementChild.cloneNode(true);
                            node.innerHTML = node.innerHTML.replace(/\[i\]/g, '.' + j);
                            list.appendChild(node);
                        }
                        items[i].removeChild(items[i].firstElementChild);
                        items[i].appendChild(list);

                    // if the data is a number or string then update the dom text content with the value and bind the data
                    } else if (type === '[object String]' || type === '[object Number]') {
                        Object.defineProperty(match.parent, match.key, this.getset(items[i], match.key, match.value));
                        items[i].textContent = match.value;
                    }
                }
            }
        },
        find: function (key, data) {
            // split the string and matche each part to an object of data
            var matchkey = '',
                matchparent = {},
                matchvalue = key.split('.').reduce(function (obj, i) {
                    if (obj[i]) {
                        matchkey = i;
                        matchparent = obj;
                        matchvalue = obj[i];
                        return matchvalue;
                    } else {
                        return false;
                    }
                }, data);
            
            // return the match plus it's parent and key for the dom binding
            return {
                value: matchvalue,
                parent: matchparent,
                key: matchkey
            };
        },
        getset: function (dom, key, value) {
            // dynamically create the get and set functions to update the dom element's content
            return {
                set: function (val) {
                    value = val;
                    dom.textContent = val;
                },
                get: function () {
                    return value;
                }
            };
        }
    };
    // check the body element, if the data attrbiute is set then autoload
    var root = document.body.getAttribute(module.attrib);
    if (root && window[root]) {
        module.init(window[root]);
    }
    return module;
}());