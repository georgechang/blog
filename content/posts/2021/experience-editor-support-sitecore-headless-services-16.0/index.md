---
title: Experience Editor Support in Sitecore Headless Services 16.0
date: 2021-04-19
categories:
  - Sitecore
draft: false
---

Recently I was converting my ASP.NET Core test project to from Sitecore 10.0 to Sitecore 10.1 (and in turn, [Sitecore Headless Services 16.0](https://doc.sitecore.com/developers/101/developer-tools/en/sitecore-headless-services.html) and ran into what we in the biz call "breaking changes". The one discussed in this post specifically is around Experience Editor support in headless applications.

## How does Sitecore Headless Services support Experience Editor?

When you open Experience Editor for a headless app, the CM server performs a `POST` to the headless services endpoint provided by the SDK which by default is mapped to the route `/jss-render`. This returns the HTML of the page with the appropriate Experience Editor magic sprinkled in and renders that HTML in Experience Editor.

To use this endpoint and Experience Editor support, you need to enable it which is done in the initial configuration of your headless application. By doing this declaratively, you can add logic to not enable this endpoint in CD scenarios which is Good Idea™.

## But wait. There's a problem.

Since the hostnames of your CM server and your rendering host is going to be different, any relative URLs would wind up being busted as it would wind up being relative to the CM hostname instead of the rendering host hostname as one would expect.

For example, let's say you had a CM server at `https://cm.sc101.com` and your rendering host at `https://app.sc101.com`. If you had a CSS tag like this:

`<link rel="stylesheet" href="/styles/main.css" />`

In Experience Editor, your browser would read your `<link>` tag and attempt to fetch `https://cm.sc101.com/styles/main.css` which won't not exist. What you want is `https://app.sc101.com/styles/main.css`.

## I thought this worked previously.

Well, it did! In Sitecore Headless Services 14.0, this remapping was on the endpoint that Experience Editor used (the `/jss-render` one from earlier) before the HTML was rendered in the Experience Editor. Therefore, you had to configure the URL of the rendering host in your rendering host application configuration.

If you looked at [Part 2 of my Sitecore Headless Development series](/posts/2020/sitecore-headless-development-with-asp.net-core-quick-start/), there were a few lines of code in `Startup.cs` to enable Experience Editor support that looked something like this:

```csharp
services.AddSitecoreRenderingEngine(options =>
  {
    ...
  })
  .ForwardHeaders()
  .WithTracking()
  .WithExperienceEditor(options =>
  {
    if (Configuration.RenderingHostUri != null)
    {
      options.ApplicationUrl = Configuration.RenderingHostUri;
    }
  });
```

Here, in the options of `.WithExperienceEditor()`, you'd set the URL of your rendering host so that the Experience Editor could rewrite any relative URLs in your rendering host with an absolute URL with the correct hostname. It's doubly important if your rendering host application is in a separate network than your Sitecore instance or has some special DNS resolution with a reverse proxy or something. The headless endpoint then uses this to rewrite your relative URLs with absolute URLs for Experience Editor.

## So what's the problem?

This is where things changed in Sitecore Headless Services 16.0. As Sitecore Headless Services starts supporting more and more languages and SDKs (ASP.NET Core, React, Next.js, etc) it made more sense for this logic to happen on the CM server instead of being implemented in every flavor of headless SDK. You'll notice now that `Sitecore.AspNet.ExperienceEditor.ExperienceEditorOptions` no longer contains a property called `ApplicationUrl` - so compiling your rendering host against 16.0 will throw a compilation error. Since you don't have to set any options in that extension method, you can now call `.WithExperienceEditor()` with no parameters.

```csharp
services.AddSitecoreRenderingEngine(options =>
  {
    ...
  })
  .ForwardHeaders()
  .WithTracking()
  .WithExperienceEditor();
```

So where does that property get set now? Thanks to the insight provided by [Nick Wesselman](https://twitter.com/techphoria414), there is a new attribute in your headless app Sitecore configuration called `serverSideRenderingEngineApplicationUrl` which is where you would set the URL for your rendering host. This attribute is in the `configuration/sitecore/javaScriptServices/apps/app` config node that you created for your headless application initially. For those of you using SXA, this is a new field on the `Settings` item on your site.

So, your config should look something like this:

```xml
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/" xmlns:set="http://www.sitecore.net/xmlconfig/set/">
  <sitecore>
    <javaScriptServices>
      <apps>
        <app name="renderingHost"
             sitecorePath="/sitecore/content/SC101"
             serverSideRenderingEngine="http"
             serverSideRenderingEngineEndpointUrl="http://app/jss-render"
             serverSideRenderingEngineApplicationUrl="https://app.sc101.com"
             inherits="defaults" />
      </apps>
    </javaScriptServices>
  </sitecore>
</configuration>
```

You'll notice that the hostname for the endpoint URL and the application URL could be different here - the endpoint URL can be the internal DNS for your rendering host. If your CM server can communication with your rendering host with a private DNS resolution (e.g., Kubernetes), this would be the place to put your private domain name. The application URL has to be publicly (or at least as public as your CM hostname is) resolvable as that's the URL that your browser will use.

## That makes sense...I think. Thanks George!

![Anna Kendrick giving you a salute](img/anna.webp)
