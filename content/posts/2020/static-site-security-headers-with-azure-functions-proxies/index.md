---
title: Static Site Security Headers with Azure Functions Proxies
date: 2020-12-05
categories:
  - Azure
draft: true
---

If you haven't been paying attention in the internet world in the past year or so, **static site generation** (a.k.a. SSG) is the new hotness!

So what exactly is static site generation anyways? Well, back in the olden days, we used to write HTML by hand. Like, we actually typed out `<html>` and stuff in Notepad or something. This all went in a `.html` file and put on a web server somewhere and then the internets could browse to it. Think of SSG as code-gen for this process. Take some templates and some content, run it through a process, output some `.html` files to put on a web server. We've come full-circle. 😄

Do you know what that web server doesn't need? Node. ASP.NET. PHP. Any other server-side processing. There's no processing, just serving up some straight up HTML files. So, you can imagine, it's FAST. Now that we have CDNs that can bring those files to the edge, it can now be super fast anywhere in the world.

There's just one problem though: if you don't need the overhead of a full-blown web server with server-side processing, you lose a lot of the benefits that they bring as well - one of which is security headers.

Security headers dictate what your site can and cannot do - for example, it can say your site can only load CSS from your domain or only images for your domain and a domain for your DAM or you have to require HTTPS to access the site - stuff that prevent someone from hijacking your site for nefarious purposes. These headers come through as part of the response from the web server when delivering your page. If you don't have a robust web server to be able to configure these headers, what can you do?

Azure Functions has this cool feature called **proxies**. Proxies are basically HTTP trigger functions under the covers that do a very specific task that you can configure in the portal (which is actually just configured in a `proxies.json` file). There's no code you have to deal with or anything, and since Azure Functions can be consumption-based, you're only paying for the requests that go through this proxy.
