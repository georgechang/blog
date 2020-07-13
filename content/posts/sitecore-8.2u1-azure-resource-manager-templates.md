---
title: Sitecore 8.2u1 Azure Resource Manager Templates
date: 2016-12-13
categories: 
- Sitecore
- Azure
---

The Sitecore and Microsoft worlds have been abuzz lately with the latest iteration of Sitecore's Experience Platform product - version 8.2 Update 1. The big feature update with Update 1 is full support for [Azure Resource Manager](https://azure.microsoft.com/en-us/features/resource-manager/) support for the Sitecore platform. Deploying Sitecore on Azure has actually been available since version 6.3 with the Sitecore Azure module. However, the Sitecore Azure module was largely dependent on the old Azure Cloud Services and Azure Storage and was not widely adopted due to technical and administrative challenges.

Enter the Sitecore Azure Toolkit - the result of Sitecore's recent commitment to their partnership with Microsoft. The Sitecore Azure Toolkit brings the power of infrastructure-as-code/configuration to Sitecore through the Azure Resource Manager. Using ARM templates, a Sitecore deployment can be quickly configured through JSON files and Azure takes care of the rest. As such, Sitecore has built in support for modern Azure services such as [Azure App Services](https://azure.microsoft.com/en-us/services/app-service/), [Azure SQL](https://azure.microsoft.com/en-us/services/sql-database/), [Azure Search](https://azure.microsoft.com/en-us/services/search/), [Azure Redis Cache](https://azure.microsoft.com/en-us/services/cache/), and [Application Insights](https://azure.microsoft.com/en-us/services/application-insights/). These services are consumption-based and highly-scalable to demand.

Sitecore has provided some quickstart ARM templates on [GitHub](https://github.com/Sitecore/Sitecore-Azure-Quickstart-Templates). These templates can be used to deploy environments immediately with the Sitecore Azure Toolkit. They can also be modified to your liking as far as sizing and options. All of the templates use App Services for the web applications, Azure SQL for databases, Azure Search for search, Azure Redis Cache for caching, and Application Insights for logging and monitoring. There are 3 templates out there as of today:

## Sitecore 8.2u1 XP

![xp](/content/images/2018/04/xp.jpg)

This is a full-blown production-ready deployment of the Sitecore Experience Platform with xDB support. This template will create 4 web app services each in their own hosting plan. This allows each of the web apps to be scaled independently of one another - for example, if there's a spike in demand on your site, you can scale up the content delivery and processing web applications to better handle traffic and the associated user data. Additionally, the web database is in its own Azure SQL Server for the same reason - the ability to scale the web database independently from the other databases based on demand.

## Sitecore 8.2u1 XP0

![xp0](/content/images/2018/04/xp0.jpg)

This is also a fully-featured deployment of the Sitecore Experience Platform with xDB support, however, this is intended for internal development or testing uses only. The 4 separate web app services from the previous template have been consolidated down to one as there will not be a need to efficiently scale a test environment. Everything else remains the same as the previous configuration.

## Sitecore 8.2u1 XM

![xm](/content/images/2018/04/xm.jpg)

This is a production-ready deployment of the Sitecore Experience Management product - what Sitecore refers to their CMS-only product. This does not include xDB support or the analytics associated with compiling user data. The XM configuration is effectively the same as the XP configuration with the web apps for the processing and reporting roles and the reporting SQL database removed.

There are a few caveats with these ARM templates that we'll talk about in a future blog post. Regardless, this is a huge step forward for Sitecore and Azure!

For more information regarding Sitecore 8.2u1 on Azure, check out the Sitecore documentation site here: https://doc.sitecore.net/cloud/working_with_sitecore_azure/sitecore_azure_overview

