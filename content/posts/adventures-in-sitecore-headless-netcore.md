---
title: Adventures in Sitecore Headless Development with ASP.NET Core
date: 2020-08-25
categories:
  - Sitecore
draft: true
---

With the release of Sitecore 10 brings along a new development experience for Sitecore developers. If you're familiar with JSS, think of this as JSS for .NET Core. Sitecore basically acts as a content repository and the engine for component management and marketing automation. Your application (in this case, an ASP.NET Core appliation) treats Sitecore as a super-fancy web service where it gets data, component placement, and other fun stuff.

Okay, enough of the boilerplate stuff. Let's get into the nitty gritty.

## Setup

For starters, you'll want to create an ASP.NET Core web project. You can use the standard `dotnet new web` or `dotnet new mvc` to spin up a new project. Alternatively, you can use the Getting Started template provided by Sitecore here. To install the template, run the following command:

`dotnet new -i Sitecore.DevEx.Templates --nuget-source https://sitecore.myget.org/F/sc-packages/api/v3/index.json`

Now, you should be able to do `dotnet new sitecore.aspnet.gettingstarted` and get a new instance spun up with all of the default Sitecore configurations including a Docker setup!

## The Sitecore Bits
