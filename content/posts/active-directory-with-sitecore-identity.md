---
title: Active Directory with Sitecore Identity
date: 2019-06-23
description: The definitive guide to using on-premises Active Directory with Sitecore Identity
draft: true
category: 
- Sitecore
- authentication
---

With the release of Sitecore 9.1 and the introduction of Sitecore Identity, the legacy Sitecore Active Directory module is no longer supported for authentication to the administration portal. This becomes a barrier of entry to upgrading to 9.1 and beyond as customers who rely on an on-premises instance of Active Directory (a.k.a. Active Directory Domain Services a.k.a. AD DS) will need to figure out a replacement for the deprecated module.

To start, let's look at what the legacy Sitecore Active Directory module did:

- injects a custom membership provider (`LightLDAP.SitecoreADMembershipProvider`) to handle authentication using Active Directory via LDAP by,
  - creating an LDAP connection to an on-premises Active Directory instance using a specified connection string over port 389
  - retrieve directory entries from the LDAP connection with the SASL protocol and encrypting data using sign and seal
