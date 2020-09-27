---
title: Deploy a Folder to Azure App Services Using Azure Pipelines
date: 2020-09-15
categories:
  - Azure
---

Recently someone I worked with was struggling with deploying a folder of files into an Azure App Service. What resulted was an unnecessarily convoluted PowerShell script inline in the YAML file that uploaded each file via the Kudu API.

There's a task called [AzureRmWebAppDeployment](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) that you can plug into your YAML and point it to something for MSDeploy to deploy to the app service. That's right, it's the same exact step you use to deploy anything else to an Azure App Service.

Contrary to popular belief (and apparently there are no articles about this out there), it doesn't _have_ to be a web deploy package or a zip file - you can just point it at a folder of files and it'll deploy files relative to the root of the app service. If you need those files in a certain structure, you'll need to have the folder structure you're deploying to match the folder structure you want to be deployed onto the app service.

This is some super basic YAML to show how to deploy the contents of a `hello` folder from a repository directly into an app service.

```yaml
trigger:
  - master

pool:
  vmImage: "windows-latest"

steps:
  - task: AzureRmWebAppDeployment@4
    inputs:
      ConnectionType: "AzureRM"
      azureSubscription: "Azure"
      appType: "webApp"
      WebAppName: "my-cool-webapp"
      Package: "$(System.DefaultWorkingDirectory)/hello"
      enableCustomDeployment: true
      DeploymentType: "webDeploy"
      TakeAppOfflineFlag: false
      ExcludeFilesFromAppDataFlag: false
```

You may be thinking, but George, this is exactly what the examples look like from Microsoft! You're not wrong. It just works. There's absolutely nothing special you need to do.

Now there's an article about it if someone needs you to show them an article that says it can be done.
