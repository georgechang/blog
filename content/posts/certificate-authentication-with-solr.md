---
title: Certificate Authentication with Solr
date: 2018-08-01
categories: 
- Solr
---

Securing your Solr instance is an important part of the Sitecore security hardening process. In many on-premises environments, the Solr servers are behind the firewall without the need to be publicly accessible - just accessible by the Sitecore application itself. However, with cloud-based hosting such as Azure App Services, this becomes more difficult as the Solr implementation will need to be accessible by the App Service over the internet. This means we have to secure our Solr instances! We can use basic username/password authentication, but where's the fun in that? Let's authenticate with client certificates!

## Solr Configuration

Let's begin by configuring Solr to require client authentication for all requests. The key configuration value that is needed is in `bin/solr.in.cmd` with the key `SOLR_SSL_NEED_CLIENT_AUTH`. The value of this key should be set to true to require all requests to be authenticated. You might notice another key that is named `SOLR_SSL_WANT_CLIENT_AUTH` which enables clients to be able to authenticate against the Solr instance but is not required. The value for this key should be set as false as the two configuration settings are mutually exclusive.

Reference: https://lucene.apache.org/solr/guide/6_6/enabling-ssl.html#EnablingSSL-SetcommonSSLrelatedsystemproperties

## Generate Certificates

You will want to generate a client authentication certificate that follows the certificate chain currently configured in the `SOLR_SSL_TRUST_STORE` configuration. If you've used a self-signed certificate and imported it into your key store, you can create a client authentication certificate that is issued by the certificate in the key store. You can do this by issuing a certificate signing request (CSR), then sign the request by the certificate in the key store. Depending on the tools you're using, there are different ways to approach this. OpenSSL is a great tool to handle a number of operations with certificates, including creating and fulfilling CSRs.

Once you get your signed client authentication certificate, install it on your Sitecore server and make sure you grant permissions to your application pool user to the private key. Take note of the certificate thumbprint as you'll need it in your Sitecore configuration shortly.

## IHttpWebRequestFactory Implementation

The default install of Solr comes with no authentication configured. There is the possibility of [configuring basic authentication with a username/password](https://doc.sitecore.net/sitecore_experience_platform/setting_up_and_maintaining/search_and_indexing/protecting_solr_over_http) using the `SolrNet.dll` library and Sitecore configuration updates. However, the version of `SolrNet.dll` that Sitecore is using (0.4.0.2002 to be specific - caution if you're trying to pull this from NuGet as this version is not in the repo) includes capabilities for basic authentication with the `BasicAuthHttpWebRequestFactory` but does not provide an implementation of `IHttpWebRequestFactory` for certificate authentication. Thanks to good architecture patterns, we can solve this problem ourselves!

In `SolrNet.dll`, whenever a request is made to the Solr server, it creates the web request using an implementation of `IHttpWebRequestFactory`. As mentioned previously, there is already an implementation of `IHttpWebRequestFactory` called `BasicAuthHttpWebRequestFactory` which creates the web request with the appropriate authentication fields. We'll just create our own implementation of `IHttpWebRequestFactory` which will attach a client authentication certificate as part of the web request!

See below for the implementation:

<script src="https://gist.github.com/georgechang/08365a8c0c4d849dfdf405faee7628b4.js"></script>

When the factory is created, the certificate is fetched from the certificate store based on a thumbprint that is configured in the Sitecore configuration (more on that later). This certificate is then used when a web request is created; when the `SolrNet.dll` calls for a web request, the Create method of this class will be executed, a web request is created, the client certificate is attached, and returned back to the SolrNet call to execute the request against the Solr server.

## Sitecore Configuration

Great, now we're sending along the client authentication certificate along with our request. Let's configure Sitecore to use this implementation for Solr.

Sitecore specifies the implementation to be used in the `configuration/sitecore/contentSearch/indexConfigurations/solrHttpWebRequestFactory` node. To configure this, you'll want to use a patch file to this node that will look a lot like the following:

<script src="https://gist.github.com/georgechang/4ba28538e3b6de92b5237ac510bc3330.js"></script>

The value in the `<param>` node is what will be used as the constructor parameter for the class we just implemented. This sets the constructor parameter thumbprint to the value provided. This is where you'll want to put the thumbprint of your Solr client authentication certificate.

With that, you should have Sitecore configured to connect to Solr with a client authentication certificate! Now your Solr server is nice and secure even if it needs to be exposed to the internet.
