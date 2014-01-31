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
            this.data = data;
            // get element by id otherwise use the document body
            if (id) {
                this.setup(data, document.getElementById(id).getElementsByTagName('*'));
            } else {
                /* Use document.body.getElementsByTagName('*')
                 * instead of document.getElementsByTagName('*')
                 * because we don't need to include html, head, title etc
                 */
                this.setup(document.body.getElementsByTagName('*'));
            }
        },
        setup: function (items) {
            var i = 0,
                j = 0,
                key = '',
                match = {},
                type = '',
                list = null,
                nodekey = '',
                item,
                itemType,
                node = false;
            
            // loop through the items and check if they have the data attribute
            for (i = 0; i < items.length; i += 1) {
                item = items[i];
                itemType = item.tagName.toLowerCase();
                //If tag is script or link, do nothing
                if(itemType =='script' || itemType =='link') continue;
                if (item.hasAttribute(this.attrib)) { // We don't need  && item !== document.body any more
                    key = item.getAttribute(this.attrib);
                    match = this.find(key);
                    type = Object.prototype.toString.call(match.value);
                    
                    // if the data attribute is an array, loop through and duplicate the dom template
                    if (type === '[object Array]') {
                        list = document.createDocumentFragment();
                        nodekey = item.firstElementChild.getAttribute(this.attrib);
                        node = false;
                        for (j = 0; j < match.value.length; j += 1) {
                            node = item.firstElementChild.cloneNode(true);
                            node.innerHTML = node.innerHTML.replace(/\[i\]/g, '.' + j);
                            list.appendChild(node);
                        }
                        item.removeChild(item.firstElementChild);
                        item.appendChild(list);

                    // if the data is a number or string then update the dom text content with the value and bind the data
                    } else if (type === '[object String]' || type === '[object Number]') {
                        Object.defineProperty(match.parent, match.key, this.getset(item, match.key, match.value));
                        //Check the item type and add content accordingly
                        switch(itemType) {
                        case 'img':
                        case 'iframe':
                            item.src = match.value;
                            break;
                        case 'input':
                        case 'textarea':
                            item.value = match.value;
                            break;
                        default:
                            item.textContent = match.value;   
                        }
                    }
                }
            }
        },
        find: function (key) {
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
                }, this.data);
            
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
