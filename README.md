# Tie

Automatic binding of data to html elements. Simply include the library and add your data-tie attributes.

Main advantages of using Tie:

 * 1.4KB in size (minified)!
 * Bind data to the dom using data-tie
 * auto load by putting data-tie an the root object name on the body

Usage example:
```html
<body data-tie="tiedata">
    <h1 data-tie="person.name"></h1>
    <h2 data-tie="person.age"></h2>
    <script>
        var tiedata = {
            person: {
                name: 'Joe Bloggs',
                age: 23
            }
        };
    </script>
    <script src="js/tie.js"></script>
</body>
```
