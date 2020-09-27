---
title: Modular JavaScript in Sitecore Renderings with RequireJS
date: 2015-09-21
categories:
  - Sitecore
  - JavaScript
---

You may have found yourself in one of more of the following situations in using JavaScript in your Sitecore renderings:

- A huge block of `<script>` tags in your `<head>` tag or at the end of your `<body>` tag that may or may not be used by your renderings but loaded regardless.
- Loading dependencies with a `<script>` tag in your rendering causing the potential for loading the same JS file multiple times.
- Poor rendering performance from JavaScript blocking.

Sitecore, as a component-based platform, has the flexibility of using various renderings on a page that can be added or removed by a content author. From a development standpoint, this means we need to ensure our code is as modular and loosely-coupled as possible so that there is minimal dependency on other components.

Recently, I’ve been using [RequireJS](http://www.requirejs.org/) as a great way to resolve these issues. Let’s jump straight in to a code sample:

```html
<div id="text"></div>

<script type="text/javascript" src="~/Scripts/jquery.js"></script>
<script type="text/javascript" src="~/Scripts/moment.js"></script>

<script type="text/javascript">
  $(document).ready(function () {
    $("#text").text(moment().calendar());
    console.log("rendering stuff");
  });
</script>
```

This is a view rendering with a basic block of code that uses [jQuery](http://jquery.com/) and [moment.js](http://momentjs.com/) to display today’s date in a div and writes a quick log in the JavaScript console. Works great, right?

It’s likely that you may want to use jQuery in another rendering. You might also really like dates and want to use this rendering multiple times on the same page. Then what? You could add jQuery to your layout and have it always load regardless of whether any components on the page use it or not. If you keep it in the rendering, it would initialize multiple times for each instance of the rendering you have on a page. Neither of those seem like good solutions.

Enter [RequireJS](http://www.requirejs.org/). RequireJS is a JavaScript file and module loader that can be used to handle dependency loading and make our Sitecore renderings more modular and loosely coupled. Here’s what that same rendering looks like with RequireJS:

```html
<div id="text"></div>

<script type="text/javascript">
  require(["rendering"], function (rendering) {
    rendering.doStuff("#text");
  });
</script>
```

You’ll notice that there’s no reference to jQuery or moment.js. We’ve actually put all of the JavaScript for this rendering in a separate JS file that looks like this:

```javascript
define(["jquery", "moment", "domReady!"], function ($, moment, doc) {
  return {
    doStuff: function (selector) {
      $(selector).text(moment().calendar());
      console.log("rendering stuff");
    },
  };
});
```

This is an AMD module that we’ve defined and is loaded when the `require()` call is made in the view rendering. The `require()` call instantiates this module and we can pass in a parameter to a defined function in this module. You’ll also notice that there is an array of dependencies as the first parameter of the `define()` function. When this module is loaded, it checks to see if jQuery and moment.js have been loaded already, and if not, they get loaded asynchronously before instantiating the module to be used. There’s another dependency I’ve got in here called domReady that causes the module to wait until the DOM has been fully loaded before RequireJS considers all of the dependencies loaded. This replaces the `$(document).ready()` that was in the original block of code. Alternatively, you can still use `$(document).ready()` in the function itself.

We can also use RequireJS to ensure that jQuery is running in noConflict mode as to not break Page/Experience Editor. I’ve created a module called noConflict.js that looks like the following:

```javascript
define(["jquery"], function () {
  jQuery = $.noConflict(true);
  return jQuery;
});
```

This in conjunction with the following `require.config()` will always ensure that jQuery is loaded in noConflict mode when loaded as a dependency:

```javascript
require.config({
  map: {
    "*": {
      jquery: "noconflict",
    },
    noconflict: {
      jquery: "jquery",
    },
  },
});
```

Now your renderings are no longer dependent on statically defined JS files and the necessary files can be lazy-loaded depending on which renderings are on the page. Also, RequireJS handles the dependency loading so that they are only loaded once and loaded asynchronously to prevent and blocking of the DOM.

You can find more information about RequireJS and its API at http://requirejs.org/. Let us know below how you’ve used this in your Sitecore projects!
