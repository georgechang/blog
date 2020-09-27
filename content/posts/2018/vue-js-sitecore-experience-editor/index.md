---
title: "Vue.js Components in Sitecore Experience Editor"
date: 2018-08-27
draft: true
categories:
  - Sitecore
---

One of the hot JavaScript frameworks these days is Vue.js and it has started to regularly find its way into modern web and Sitecore development. We're always looking to keep our customers modernized in terms of technology and have embraced Vue.js in a number of our Sitecore implementations.

Vue works quite well with Sitecore as both take a component-based approach to design - you can read more about Vue all over the web. It works great for Sitecore implementations. But we're here to talk about how Vue works in Sitecore Experience Editor. Short answer: _it doesn't_.

There are 2 main issues with using Vue components in Sitecore Experience Editor:

1. If you add a Vue component into a placeholder, the Vue component does not initialize.
2. If you have a placeholder in a Vue component, Sitecore will throw an error when you add a rendering to that placeholder.
   Vue purists will balk about this mish-mash hybrid that we're doing here with Vue and Sitecore. The thought behind Vue is that the markup is a visualization of the underlying data. To add to the page, you should add to the underlying data. Unfortunately, this clashes with the placeholder/rendering paradigm with Sitecore where a content author is able to add components to the page. Hence, our Vue components will be self-contained and not rendered based off of `data()` properties.

So let's solve these issues one at a time:

## If you add a Vue component into a placeholder, the Vue component does not initialize.

The underlying cause of this is that Vue component initialization is intentional and not eager - that is, Vue is not watching the DOM for changes and initializing new Vue component as it sees them. This is due to the architecture of Vue that the DOM should reflect the data in Vue instead of Vue updating from DOM changes. We're going to have to take this initialization into our own hands.
We can extend the default Sitecore placeholder chrome type (`Sitecore.PageModes.ChromeTypes.Placeholder`) and execute our own logic after the base logic is completed by overloading the `insertRendering()` method. This approach ensures that we are not modifying base Sitecore JavaScript files and is much more upgrade-friendly. After a rendering is inserted, we'll need to do the following:

1. Retrieve a list of globally registered Vue components.
2. Look at the DOM of the inserted rendering in the placeholder that match any of the registered Vue components.
3. Instantiate the Vue component.
4. Reset the page chrome for edit mode.

If you look at the code below, you'll notice a few quirks. Eagle-eyed observers will notice there is a `setTimeout()` for 500ms before the execution of the custom code begins. This is intentional - the base `insertRendering()` method fires off an asynchronous jQuery animation that there's no good way to tap into (at least that I know of) that lasts for 5o0ms. This `setTimeout()` is to accommodate for that animation to complete. You'll also notice there are a number of loops that run through - this is due to the fact that Sitecore stores the renderings for a placeholder in an array instead of a tree so each rendering in the array will need to be checked for possible instances of Vue components.

## If you have a placeholder in a Vue component, Sitecore will throw an error when you add a rendering to that placeholder.

This is due to the fact that Sitecore uses a `key` property in the placeholder `<code>` tag to identify the placeholder key. It also uses this property when executing the AJAX call to insert a rendering to identify the placeholder to insert the rendering into. Vue also uses the `key` property as a reserved property and takes it in as a sort of identifier for a component. When you have a placeholder in a Vue component and the Vue component is initialized, Vue sees the `key` property on the placeholder `<code>` element and consumes it for its purposes, then removes the property from the element. This is what causes the error - when the AJAX call to insert the rendering is called, the placeholder key value is empty and Sitecore does not know where to insert the rendering requested.

How do we solve this? Well, we can take advantage of the Vue rendering lifecycle and ensure that the `key` property is reinstated on any placeholders after Vue renders the component.

1. Before the Vue component renders, store the value of the placeholder key and the element's unique ID in an array.
2. Render the Vue component.
3. After the Vue component renders, take each value in the array and set the value of the `key` attribute on each tracked identifier.

## Solution Goals

The solution actually went through several iterations as there were some key tenets that I wanted to meet:

- Reusable
- Minimally intrusive
- Don't break Vue or Experience Editor

Thus, the Sitecore Experience Editor Vue plugin was born. The plugin ensures easy usage and reusability (`Vue.use(SitecoreExpEditorPlugin);`) and the ability to use a global Vue mixin in the plugin can ensure that the logic needed before the creation and after the instantiation of a Vue component will always execute without a developer needing to remember to add in something to their Vue component.

## The Plugin

The plugin is now published on npm! You can get it with:

`npm install --save-dev vue-scexpeditor`
or
`yarn add -D vue-scexpeditor`

Then, all you'll need to do to use it is to import it and use the plugin:

```javascript
import SitecoreExpEditorPlugin from "vue-scexpeditor";

Vue.use(SitecoreExpEditorPlugin);
```

## The Code

You can find the code for this on GitHub - https://github.com/georgechang/vue-scexpeditor
