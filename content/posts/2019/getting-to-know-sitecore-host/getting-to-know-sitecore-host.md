---
title: Getting to know Sitecore Host
date: 2019-01-10
categories:
  - Sitecore
---

One of the more interesting announcements made at Sitecore Symposium 2018 is the introduction of Sitecore Host in Sitecore 9.1. There were a couple of sessions devoted to the future of Sitecore and its focus on .NET Core, however, not a lot of details were given at the time. Now with the general availability of Sitecore 9.1, we're able to dig deeper into what exactly is Sitecore Host and what it means for the future of Sitecore.

Sitecore provides some documentation around Sitecore Host [here](https://doc.sitecore.com/developers/91/sitecore-experience-management/en/sitecore-host.html) if you want to give that a read first. This is a quick primer for those of you who didn't get a chance to hear about this stuff at Symposium.

## Sitecore Host - What is it?

One of the first things to understand is that Sitecore Host is not (yet) something that you or your end users would readily notice as an enhancement to the platform. Unlike JSS or SXA which can fundamentally change your development methodology and the user experience for your content authors, Sitecore Host is a change to the underlying architecture and extensibility of the Sitecore platform.

In essence, Sitecore Host provides a pluggable framework that standardizes several common pieces of base functionality for development. For example, applications and plugins built on the Sitecore Host framework share common services to handle things like dependency injection, logging, and configuration management. As a developer, you can easily inject any or all of these services into your Sitecore Host code and use them as you need.

One of the really interesting things that Sitecore Host brings is its plugin-based architecture. Implementation of a Sitecore Host application involves integrating one or more plugins to form the full application. These plugins can range from first-party Sitecore plugins (such as support for web) or completely custom plugins that you develop within Visual Studio. Additionally, as a developer you can extend the functionality of an existing Sitecore Host application by integrating plugins at runtime. This allows you to extend and modify the base application without ever needing to change the underlying application code.

### Sitecore Host Root

This is the core application that executes and runs. For example, in Sitecore Identity in Sitecore 9.1, this is a .NET Core 2.1 web application hosted through a Kestrel web server via IIS. Generally this application is pretty lightweight and depends on the plugin system to provide specific pieces of reusable functionality.

The file structure of a Sitecore Host application looks something like this:

<pre>
SitecoreHostApplication (Root)
├── *.dll
├── sitecorehost.xml
├── sitecorehost.<env>.xml
├── content/
│   ├── js/
│   │   └── *.js
│   └── style/
│       └── *.css
├── config/
│   ├── config.xml
│   └── [env]
└── views/
    └── home/
        └──*.cshtml
</pre>

### Sitecore Host Plugins

These are plugins that are used for the Sitecore Host root application. These plugins provide functionality for the main application itself. The plugin architecture of Sitecore Host allows for applications to be easily compiled with reusable pieces of functionality. For example, Sitecore provides a web framework plugin that can be used to create a web-based Sitecore Host application.

Application plugins follow this file structure:

<pre>
SitecoreHostApplication (Root)
└── sitecore/
    ├── Plugin.Alpha/
    │   ├── sitecore.plugin.manifest
    │   ├── content/
    │   └── config/
    │       └── [env]
    └── Plugin.Beta/
        ├── sitecore.plugin.manifest
        ├── content/
        └── config/
            └── [env]
</pre>

### Sitecore Host Runtime Plugins

These are additional plugins that can be used to extend the Sitecore Host application by other developers. These plugins are loaded in at runtime and are managed by the Sitecore Host plugin system in a separate .NET Core assembly load context than the rest of the appliation. You'll have access to the same services and plugins that the rest of the application does without needing to replace any of the existing code that the Sitecore Host applications ships with.

Runtime plugins follow this file structure:

<pre>
SitecoreHostApplication (Root)
└── sitecoreruntime/
    └── [env]/
        ├── *.dll
        ├── sitecorehost.xml
        ├── content/
        ├── config/
        └── sitecore/
            └── Plugin.B/
                ├── sitecore.plugin.manifest
                ├── content/
                └── config/
                    └── [env]
</pre>

If you're extending an existing Sitecore Host application, your plugins and other patch files should all reside in the `sitecoreruntime` folder.

You'll notice that the structure of what's under the `<env>` folder is basically a mirror of the Sitecore Host application folder structure - this is not a coincidence. At runtime, the Sitecore Host framework patches in the base Sitecore Host application using the structure and files provided in the `sitecoreruntime` folder.

## Where is Sitecore Host used?

In Sitecore 9.1, the Sitecore Identity and Universal Tracker functionality are Sitecore Host applications. You'll notice that they are hosted in their own application with their own separate domain names. The Sitecore Host applications are standalone applications outside of the Sitecore context.

## What can I do with Sitecore Host today?

At the moment, Sitecore Host is still in its beginning stages but as more and more features and functionality of Sitecore turn towards microservices, expect to see that these microservices are built on Sitecore Host and its pluggable architecture. You can take development on Sitecore Host for a spin today by extending the Sitecore Identity and Universal Tracker functionality with your own plugins. While Sitecore Identity ships with Azure AD support, other authentication mechanisms are dependent on plugins to be able to provide that functionality.
