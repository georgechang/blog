---
title: "Using PKCS #12 (.pfx) Certificates with Solr"
slug: "using-pkcs12-pfx-certificates-with-solr"
date: 2018-08-20
categories:
  - Sitecore
  - Solr
---

Apache Solr is based on the Java technology stack which comes with its own methods for handling certificates, specifically with the JKS (Java Key Store) file type which holds encrypted certificates for use with Java-based applications. You might be vaguely familiar with the JKS file as the installation guide for 9.0+ provided by Sitecore sends you to the following page on the Solr website to enable SSL:

https://lucene.apache.org/solr/guide/6_6/enabling-ssl.html

These are the basic steps per the guide above:

1. Use keytool to create a self-signed certificate and package it into a `.jks` file
2. Convert the resulting `.jks` file into a PKCS #12 `.p12` file to be imported into Windows
3. Import the `.p12` file into the Windows certificate store to be trusted
4. Update `solr.in.cmd` to point to the generated `.jks` file

## But wait - Solr can also use PKCS #12 files natively!

This may not seem like a big deal but the PKCS #12 standard is compatible with more platforms than just Java (including Windows!) and can make things a little easier to work with. Why mess with all this JKS stuff? That's a great question. If we don't have to deal with creating `.jks` files, our lives get somewhat easier.

1. Use PowerShell to generate a self-signed certificate _(Windows 10 / Server 2016)_ in the Trusted Root Certification Authorities store
2. Export the certificate as PKCS #12
3. Update `solr.in.cmd` to point to the exported `.pfx` file

Or if you're obtaining a certificate from a provider, it's just:

1. Import certificate into the Windows Certificate store
2. Update `solr.in.cmd` to point to the `.pfx` file

### What's different?

The only thing that will be different in the solr.in.cmd configuration is that instead of

`set SOLR_SSL_KEY_STORE=C:\solr-6.6.2\server\etc\localhost.jks`
`set SOLR_SSL_KEY_STORE_TYPE=JKS`  
and  
`set SOLR_SSL_TRUST_STORE_TYPE=JKS`
`set SOLR_SSL_KEY_STORE=C:\solr-6.6.2\server\etc\localhost.jks`

you would have

`set SOLR_SSL_KEY_STORE=C:\solr-6.6.2\server\etc\localhost.pfx`
`set SOLR_SSL_KEY_STORE_TYPE=PKCS12`  
and  
`set SOLR_SSL_KEY_STORE=C:\solr-6.6.2\server\etc\localhost.pfx`
`set SOLR_SSL_TRUST_STORE_TYPE=PKCS12`

Easy, right?

### Can someone just do this for me?

You might be thinking,

> George, this doesn't make my life any easier. I'm not seeing how this would make my life better. Why won't you make my life better?

Well, how about I script out steps 1 and 2 above for you in PowerShell? You just have to go update your `solr.in.cmd` file and you're in business.

```powershell
# the domain name of your Solr instance
$domainName = "localhost"
# the path of to export your .pfx file
$pfxPath = "C:\solr-6.6.2\server\etc\cert.pfx"
# the secret to assign your exported .pfx file
$pfxPassword = ConvertTo-SecureString -String "secret" -Force -AsPlainText

New-SelfSignedCertificate -DnsName $domainName -CertStoreLocation cert:\LocalMachine\My | % { Move-Item -Path Cert:\LocalMachine\My\$($_.Thumbprint) -Destination Cert:\LocalMachine\Root; Export-PfxCertificate -Cert $_ -FilePath $pfxPath -Password $pfxPassword }
```
