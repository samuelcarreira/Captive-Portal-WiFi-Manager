Key features

- Modern UI
- Vanilla JS and CSS (No frameworks like bootstrap or JQuery)
- Compatible with most recent browsers.
- Designed with accebility in mind (ARIA tags)
- Single page design with all assets inline (prevent multiple HTTP requests to ESP which in my opinion supplants the disavantage of not make use of the browser cached assets).
- Automated build task. The included gulp script does the following:
  - optimize the images compression
  - inline all the styles, scripts and images assets
  - minify the webpage
  - compress to gzip
  - convert to C byte array and save a C header file

## About the dialog ("modal popup")
My first approach was to use the native HTML5 `dialog` tag (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) but this feature isn't yet supported by Safari. I've could use the dialog polyfill (https://github.com/GoogleChrome/dialog-polyfill) but that will at least double the bundle size. So my solution was to create a custom dialog with the good old `div` tag and some code.
With my solution you can create multiple dialogs without write individual code to trigger each one. The JS code scans for all dialogs and buttons on the page load and add the event listeners to open/close them.

**Dialog Structure (minimal code)**
```
<button data-dialog_open="dialog-info">Open Dialog</button>

<div tabindex="-1" role="dialog" aria-hidden="true" id="dialog-info" class="dialog-container">
    <!-- Optional Close button -->
    <button data-dialog_close="dialog-info">&times;</button>
    <div>
    <!-- Content goes here -->
    </div>
</div>
```


## Credits
Radio button CSS style from: https://github.com/finnhvman/matter 

