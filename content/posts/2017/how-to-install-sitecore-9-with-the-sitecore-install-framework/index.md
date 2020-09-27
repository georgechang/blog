---
title: How to Install Sitecore 9 with the Sitecore Install Framework
date: 2017-10-23
categories:
  - Sitecore
---

The big news coming out of Sitecore Symposium last week is the release of Sitecore Experience Cloud 9.0. With the release of version 9, Sitecore has brought more and more pieces of its platform into an inevitably microservices-oriented future. The first thing you'll notice is that there's no `.exe` installer anymore - this has regularly a quick way to install Sitecore but with the new dependencies on SSL for xConnect and the various options for configuring xDB and databases, Sitecore has abandoned the .exe installer and replaced it with something much better and much more configurable called the Sitecore Install Framework.

The Sitecore Install Framework (commonly referred to as SIF since every Sitecore product needs a good acronym) can be daunting at first but is actually pretty straightforward. I'll go into more detail about SIF in a later blog post but basically Sitecore provides what is effectively a PowerShell-based task runner and a handful of tasks that can be performed. This also means that you can create your own tasks to execute as part of the install process that can be tailored for your specific environment(s).

For this blog post, however, we'll focus on the most basic (and likely most common) install scenario - the all-in-one development installation. This is where all of the Sitecore and xConnect roles are all on a single machine that is also likely hosting SQL Server and Solr as well. For this, we'll need the Sitecore Install Framework to run the following tasks:

- Install client certificates for xConnect
- Install xConnect
  - Install Solr cores for xDB
  - Deploy the xConnect web deploy package
    - Create and deploy the web application
    - Deploy the databases
    - Create the Windows services for marketing automation and search indexing
- Install Sitecore
  - Install Solr cores for Sitecore
  - Deploy the Sitecore web deploy package
    - Create and deploy the web application
    - Deploy the databases
    - Associate the Sitecore instance with the deployed xConnect instance

Fortunately, Sitecore provides all of these steps for you - all you need to do is to execute them with the proper parameters. In the Sitecore 9 Installation Guide, Sitecore walks you through the various services and how to install each one. The modules can be obtained from the Sitecore download site or more preferably from the Sitecore MyGet repository. To install the modules, run the following PowerShell commands:

```powershell
# Add the Sitecore MyGet repository to PowerShell
Register-PSRepository -Name SitecoreGallery -SourceLocation https://sitecore.myget.org/F/sc-powershell/api/v2

# Install the Sitecore Install Framwork module
Install-Module SitecoreInstallFramework

# Install the Sitecore Fundamentals module (provides additional functionality for local installations like creating self-signed certificates)
Install-Module SitecoreFundamentals

# Import the modules into your current PowerShell context (if necessary)
Import-Module SitecoreFundamentals
Import-Module SitecoreInstallFramework
```

If you skip to the end of the deployment guide, you'll find a convenient block of PowerShell code that executes the installation for you:

```powershell
#define parameters
$prefix = "sc90"
$PSScriptRoot = "C:SitecoreInstallSitecore 9.0.0 rev. 171002"
$XConnectCollectionService = "$prefix.xconnect"
$sitecoreSiteName = "$prefix.local"
$SolrUrl = "https://localhost:8983/solr"
$SolrRoot = "C:solr-6.6.2"
$SolrService = "solr662"
$SqlServer = "localhost"
$SqlAdminUser = "sc90"
$SqlAdminPassword = "password"

#install client certificate for xconnect
$certParams =
@{
  Path = "$PSScriptRootxconnect-createcert.json"
  CertificateName = "$prefix.xconnect_client"
}
Install-SitecoreConfiguration @certParams -Verbose

#install solr cores for xdb
$solrParams =
@{
  Path = "$PSScriptRootxconnect-solr.json"
  SolrUrl = $SolrUrl
  SolrRoot = $SolrRoot
  SolrService = $SolrService
  CorePrefix = $prefix
}
Install-SitecoreConfiguration @solrParams -Verbose

#deploy xconnect instance
$xconnectParams =
@{
  Path = "$PSScriptRootxconnect-xp0.json"
  Package = "$PSScriptRootSitecore 9.0.0 rev. 171002 (OnPrem)_xp0xconnect.scwdp.zip"
  LicenseFile = "$PSScriptRootlicense.xml"
  Sitename = $XConnectCollectionService
  XConnectCert = $certParams.CertificateName
  SqlDbPrefix = $prefix
  SqlServer = $SqlServer
  SqlAdminUser = $SqlAdminUser
  SqlAdminPassword = $SqlAdminPassword
  SolrCorePrefix = $prefix
  SolrURL = $SolrUrl
}
Install-SitecoreConfiguration @xconnectParams -Verbose

#install solr cores for sitecore
$solrParams =
@{
  Path = "$PSScriptRootsitecore-solr.json"
  SolrUrl = $SolrUrl
  SolrRoot = $SolrRoot
  SolrService = $SolrService
  CorePrefix = $prefix
}
Install-SitecoreConfiguration @solrParams -Verbose

#install sitecore instance
$sitecoreParams =
@{
  Path = "$PSScriptRootsitecore-XP0.json"
  Package = "$PSScriptRootSitecore 9.0.0 rev. 171002 (OnPrem)_single.scwdp.zip"
  LicenseFile = "$PSScriptRootlicense.xml"
  SqlDbPrefix = $prefix
  SqlServer = $SqlServer
  SqlAdminUser = $SqlAdminUser
  SqlAdminPassword = $SqlAdminPassword
  SolrCorePrefix = $prefix
  SolrUrl = $SolrUrl
  XConnectCert = $certParams.CertificateName
  Sitename = $sitecoreSiteName
  XConnectCollectionService = "https://$XConnectCollectionService"
}
Install-SitecoreConfiguration @sitecoreParams -Verbose
```

One of the prerequisite steps is to have Solr already installed and SSL for your Solr instance configured. While the Installation Guide specifies Solr 6.6.1, I found out the hard way that there is a bug in Solr 6.6.1 which will cause the following error in the deployment process as it tries to start the same cores multiple times:

```powershell
Invoke-ManageSolrCoreTask : Error CREATEing SolrCore 'sc90_xdb': Unable to create core [sc90_xdb] Caused by: null
At C:Program FilesWindowsPowerShellModulesSitecoreInstallFramework1.0.2PublicInstall-SitecoreConfiguration.ps1:253 char:21
+                     & $entry.Task.Command @paramSet | Out-Default
+                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:) [Write-Error], WriteErrorException
    + FullyQualifiedErrorId : Microsoft.PowerShell.Commands.WriteErrorException,Invoke-ManageSolrCoreTask
```

This bug is fixed in Solr 6.6.2 and onwards so I would recommend using Solr 6.6.2 instead of 6.6.1. If you're looking for the Bitnami installer for Solr 6.6.2, there isn't one - you'll have to install it the old fashioned way.

You'll want to make sure the parameters at the top of the PowerShell script contain the correct values and that your web deploy packages, configuration JSON files, and Sitecore license are all located in the `$PSScriptRoot` folder. Execute this PowerShell script and you should be up and running in just a couple of minutes!
