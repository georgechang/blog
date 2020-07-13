---
title: "Federated Authentication in Sitecore 9 - Part 3: Implementation of SAML2p"
date: 2018-06-06
categories: 
- Sitecore
- authentication
---

Let's jump into implementing the code for federated authentication in Sitecore!

If you've missed Part 1 and/or Part 2 of this 3 part series examining the federated authentication capabilities of Sitecore, feel free to read those first to get set up and then come back for the code.

[Part 1: Overview](/2018/01/23/federated-authentication-in-sitecore-9-part-1-overview)
[Part 2: Configuration](/2018/01/30/federated-authentication-in-sitecore-9-part-2-configuration)

For this example, we'll be using the SAML2p library by Sustainsys - formerly known as Kentor. You'll see some references to Kentor in the code - the version available as of this blog post is still in the middle of the process of renaming so you'll see the "Kentor" name scattered around the code. Just know that this is the Sustainsys SAML2p library.

Fortunately the library provides OWIN middleware for authentication so it will be fairly straightforward to implement. There are a couple of sections that will need to be configured:

## Registering the SAML2 Identity Provider

The SAML2 identity provider will need to be registered in Sitecore to be used with the appropriate sites. More details around this config file can be found in Part 2. For now, this is the config file for the SAML2 identity provider:

<script src="https://gist.github.com/georgechang/514baacae2b47bd513e1e6f89b8a9a62.js"></script>

There is nothing particularly special about this configuration - just be aware that there is a mapping in this config that maps everyone who logs in with the saml2 identity provider to be administrators. You should most definitely take that out.

## Injecting into the OWIN Pipeline through the Sitecore `<owin.identityProviders>` Pipeline

Now comes the fun code part! We'll need to create a class that overrides `Sitecore.Owin.Authentication.Pipelines.IdentityProviders.IdentityProvidersProcessor`. This will be a Sitecore pipeline processor that Sitecore will execute at the appropriate time in the OWIN pipeline for authentication. The ProcessCore method is where you'll be doing all the work for the authentication. The method provides a parameter of type `Sitecore.Owin.Authentication.Pipelines.IdentityProviders.IdentityProvidersArgs` that provides a reference to `Owin.IAppBuilder` to which you can hook up middleware. You'll see in the code below that some options are set for the Sustainsys SAML2 OWIN middleware and the code `args.App.UseSaml2Authentication(options)` is called. This registers the SAML2 middleware with the OWIN pipeline.

<script src="https://gist.github.com/georgechang/bf8b8fac828ab60dcf0a26c384ff2351.js"></script>

## Executing Claims Transforms on the `ClaimsIdentity`

In your identity provider configuration, you have the option of setting claims transformations for that specific identity provider. However, there are some shared claims transformations that apply to all providers - one in particular that is in by default is the one for the `idp` claim. You'll notice in line 41 of `Saml2IdentityProviderProcessor.cs` that there is a hook into a notification provided by the SAML2 middleware that will execute the following code:

```csharp
var identityProvider = GetIdentityProvider();
((ClaimsIdentity)result.Principal.Identity).ApplyClaimsTransformations(new TransformationContext(FederatedAuthenticationConfiguration, identityProvider));
```

Basically, this ensures that after authentication is complete, all of the claims transformations are executed on the returned `ClaimsIdentity` so that the expected claims are being created on the identity. This should be executed whenever authentication is complete - other authentication middlewares may provide other events such as `OnAuthenticate` that you can hook into and execute similar code.

Believe it or not, that's it! This is a more complex example than usual due to its need for an external library, however, there are built in NuGet packages for other authentication providers that are quite straightforward to set up. If you'd like to see this example and others, including implementations for Facebook, Google, and Azure AD with OpenID Connect, feel free to peruse [this GitHub repository](https://github.com/georgechang/Ignition.Foundation.Authentication). Enjoy!
