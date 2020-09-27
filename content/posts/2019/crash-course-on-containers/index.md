---
title: A Crash Course on Containers
date: 2019-09-25
categories:
  - Sitecore
  - Containers
draft: true
---

One of the cool new things out in the tech world right now is containerization - but what exactly is it and what do I do with it?

Containers have been around in the Linux world for some time now, however, it's only recently that their Windows counterparts got to experience it for themselves. Microsoft released container support with Windows Server 2016 and Windows containers were born.

> This post is for all of you .NET developers who have been working in Windows for so long.

## So what exactly are containers?

Some people refer to containers as mini virtual machines, but I think that brings along some external baggage that causes the analogy to break down. I like to think of containers are the evolution of applications. Applications often require a number of dependencies that they expect to be available for their application to work. One of the dependencies you may be most familiar as Microsoft developers is the .NET runtime. If you wrote an application on the .NET platform and you wanted to give it to a friend to run on their machine, you'd have to make sure that they had the proper version of the .NET Framework/.NET Core runtime installed in order to run the application. If it was a web application, you'd expect to have IIS as a dependency. Even if you package your application in an installer, the installer would still need to install those dependencies.

Now imagine if you gave your friend one big file with all the dependencies already all bundled in. It doesn't matter what they have installed or not installed on their computer - all you need to know is what version of the OS they're running. Do they have .NET Framework installed? Doesn't matter. Do they have IIS? Not my problem. Do they have some weird OS configuration going on? Who cares.

Containers only depend on the kernel of the OS, that is, the core chunk of the operating system that handles the low level instructions of the operating system. This is where stuff like hardware drivers and the like live. Your container OS does need to vaguely match your host OS (Windows is more particular about this) but otherwise it's pretty flexible.

## How about an example?

## You haven't said anything about Docker yet.

Docker has become synonymous with containers because Docker has made containers accessible and easy to use. While Docker holds the significant majority (like 80+%) of the container market, there are also other containerization technologies that do similar things such as CoreOS rkt and Mesos. It's a Kleenex/tissue situation.

## Neat, so how do I get started?
