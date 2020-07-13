---
title: What's New in Identity in Sitecore 9.1
date: 2019-01-28
categories: 
- Sitecore
- authentication
---

## Overview

Sitecore 9.1 brings enhancements to the federated authentication capabilities of Sitecore 9.0 by introducing a new authentication service called **Sitecore Identity**. Sitecore Identity replaces the existing Sitecore administration login screen and introduces a separately hosted web application manage all things authentication.

This allows you to use Sitecore Identity as a custom authentication hub to manage various authentication mechanisms that you may be supporting. Think of this as a type of custom Okta-style authentication hub - you can add plugins to handle any kind of authentication you want but to Sitecore it's just a single external identity provider that it's managing.

## What's new in Sitecore Identity?

The new Sitecore Identity service still uses the same federated authentication functionality that was part of 9.0 but instead of configuring your own identity providers directly in the Sitecore configuration, Sitecore Identity has been preconfigured as the main identity provider for Sitecore. Sitecore Identity then provides extension points as Sitecore Host plugins to implement other identity providers.

Sitecore Identity is built upon Identity Server 4, an open source ASP.NET Core based framework for claims-based authentication. Sitecore Identity ships with Azure Active Directory support via the OpenID Connect protocol, however, the framework uses the standard Microsoft OWIN libraries so implementing new authentication protocols has a fairly low barrier of entry.

## What can I do with Sitecore Identity?

Anything! Okay, maybe not anything but a lot of things. Pretty much anything you can do with the OWIN pipeline, you can do with Sitecore Identity. The most common plugins that will be created will likely be to support different authentication schemes, however, other functionality can also be added to the application.

## Revert to the Legacy Sitecore Login

You might be thinking - this is way too much change and completely overkill for our needs. I just want to use my standard Sitecore membership provider-based authentication that I have responsibly updated to use SHA512 for password encryption and not deal with any of this Sitecore Identity stuff you were just talking about.

No problem! Sitecore provides some steps to disable Sitecore Identity altogether and revert the original Sitecore login mechanism using good ol' `/sitecore/login`.
