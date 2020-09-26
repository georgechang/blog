---
title: "Sitecore Headless Development with ASP.NET Core: Components"
date: 2020-09-08
categories:
  - Sitecore
draft: true
---

Finally! Components! About time!

But first (oh come on...), let's talk about the kind of components you can create with the Sitecore ASP.NET Core SDK:

## Partial View

These are like view renderings in old-school Sitecore MVC. They don't have a defined model or anything, just a `.cshtml` view file.

## Model-Bound View

These are more similar to controller renderings with classic Sitecore MVC but without the controller. You can create a model class that the SDK binds the data to and use that model as the model for your view. In my opinion, these are likely the ones you'll build the most for your typical display-stuff-on-a-page components.

## View Components

These are new to .NET Core and give you the most flexibility in controlling the logic. Instead of a controller, a `ViewComponent` class is created that executes an `InvokeAsync` method that is responsible for binding the model to the view.
