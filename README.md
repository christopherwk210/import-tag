<h1 align="center">import-tag</h1>

Node script that transforms HTML to allows you to use `<import src="./path/to/html">` syntax. This allows you to generate static HTML files from separate, smaller components.

# Installation
```
$ npm i import-tag --save
```

# Usage

Usage inside of Node will look something like this at the very least:
```javascript
const path = require('path');
const importTag = require('import-tag');

(async () => {
  try {
    let compiledHtml = await importTag( path.join(__dirname, './index.html') );
    console.log(compiledHtml);
  } catch(e) {
    console.log(`Error: ${e}`);
  }
})();
```

Inside of your HTML file, usage looks like this:
```html
<html>
  <body>        
    <h1>Hello World</h1>
    <import src="./test.html">
  </body>
</html>
```

The import tag does not have a closing tag, and the `src` attribute must point to a relative path. Nested imports are supported, so in this example `test.html` can also contain `<import src="">` tags, and so on.

> Note:
>
> Each import tag `src` uses the relative directory of the current HTML file. Always use paths relative to the current file!

# Caveats

File paths inside of any other element are *not* transformed. This means that any paths you use inside of an imported HTML file will be relative to the parent file. Imported HTML files just become one compiled file output, so please take that in to account when writing your JS and CSS as well.
