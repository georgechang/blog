---
title: 3 Things to Remember with Sitecore Multi-Site Configuration
date: 2016-05-11
categories: 
- Sitecore
---

Multi-sites in Sitecore are a useful way to host multiple sites on the same Sitecore instance. However, there are more steps than just adding your site into the `<sites>` section in the web.config. Below are 3 things that you should always remember to set in your configuration in a multi-site (or using a site name other than the default "website") configuration - be sure to use [include config files](http://www.sitecore.net/learn/blogs/technical-blogs/john-west-sitecore-blog/posts/2011/05/all-about-web-config-include-files-with-the-sitecore-aspnet-cms.aspx) to do so!

1. **Make sure your site is listed under the ClearCache handler under the publish:end and publish:end:remote events.** When you find yourself in a situation where you can't figure out why your cached renderings aren't updating with new content, this is likely why. This is especially important in a multi-server environment as the publish:end:remote will ensure that the HTML cache is cleared on publish on all of the content delivery servers. This config change needs to happen on all Sitecore servers.
2. **Add additional sections to the `<cacheSizes>` section for site-specific cache designations.** By default, Sitecore includes cache sizing for the "website" site, however, if you have a site that's not named "website", you'll want to add an additional section with the site name and the caching values for that site.
3. **Update the Preview.DefaultSite setting value to be the new site name.** This setting lets Sitecore know which site to serve up when using the Experience Editor/Preview/Debug. If this is not set correctly, content authors will have a tough time when loading up Experience Editor to make content changes.
