---
title: "Federated Authentication in Sitecore 9 - Part 1: Overview"
date: 2018-01-23
categories: 
- Sitecore
- authentication
---

Sitecore 9.0 introduced a new and very useful feature to easily add federated authentication to the platform. Authentication has been and still is being performed using the ASP.NET Membership functionality for standard Sitecore users, however, Sitecore has implemented the ability to use the new ASP.NET Identity functionality that is based OWIN-middleware.

Here's a stripped-down look at how OWIN middleware performs authentication:

![owin](/content/images/2018/08/owin.jpg)

ASP.NET Identity also brings in a number of improvements in functionality and features such as password recovery, account confirmation, and two-factor authentication. However, one of the most compelling features is the ability to use external identity providers which is what we'll be focusing on in this blog series.

For more information about ASP.NET Identity, you can see Microsoft's documentation [here](https://docs.microsoft.com/en-us/aspnet/identity/).

## OWIN in Sitecore

In Sitecore, the OWIN pipeline is implemented directly into the platform (with its own pipeline called `<owin.identityProviders>`, naturally) to provide developers the ability to add their own OWIN middleware to be initialized and configured. If you've used OWIN middleware with IIS before, you're familiar with a startup class and the OWIN libraries registering your middleware upon application initialization. Sitecore has already created the startup class (`Sitecore.Owin.Startup`) with the boilerplate code to support Sitecore authentication. The startup class then executes a Sitecore pipeline to register other middleware modules. This is where you come in.

![yo-dawg-i-heard-you-like-pipelines-so-we-put-a-pipeline-in-your-pipeline](/content/images/2018/08/yo-dawg-i-heard-you-like-pipelines-so-we-put-a-pipeline-in-your-pipeline.jpg)

Microsoft has already created a number of OWIN middleware modules for common authentication schemes and released them on NuGet for use at your leisure.

They include:

Facebook: <https://www.nuget.org/packages/Microsoft.Owin.Security.Facebook>
Google: <https://www.nuget.org/packages/Microsoft.Owin.Security.Google>
Twitter: <https://www.nuget.org/packages/Microsoft.Owin.Security.Twitter>
Microsoft: <https://www.nuget.org/packages/Microsoft.Owin.Security.MicrosoftAccount>
OAuth 2.0: <https://www.nuget.org/packages/Microsoft.Owin.Security.OAuth>
ADFS (WS-Federation): <https://www.nuget.org/packages/Microsoft.Owin.Security.WsFederation>
Azure AD (OpenID Connect): <https://www.nuget.org/packages/Microsoft.Owin.Security.OpenIdConnect>

If you're feeling really awesome, you can write your own as well. In the example in [part 3](/2018/06/06/federated-authentication-in-sitecore-9-part-3-implementation-of-saml2p), we'll be implementing the popular SAML2p authentication services by [Sustainsys](https://github.com/Sustainsys/Saml2) (the artist formerly known as Kentor).

## Sitecore Login with Federated Authentication

By implementing OWIN and external identity providers into your Sitecore instance, your Sitecore login screen will start looking something like this:

![login](/content/images/2018/08/login.jpg)

Clicking on any of the provider buttons will redirect you to the authentication provider's login page. After you're authenticated by the identity provider, you'll be redirected back to the Sitecore administration site as if you had logged in with the standard Sitecore login screen.

So what's next? Let's configure Sitecore for federated authentication!
