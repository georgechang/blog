---
title: A Letter to my Future Self about Kubernetes
date: 2020-06-26
categories:
  - Containers
---

## Dear future George,

I've spent the past week or so working deep in Kubernetes, getting to know it, understand it, and build stuff on top of it. You, unfortunately, have gotten distracted by other things since then. If you're reading this letter, this means you've forgotten most of what you've learned and are trying to desperately retain this knowledge. I'm here to help you.

---

Okay, first, the basics.

### Nodes

These are the servers that run your containers. They're controlled by an agent called a _kubelet_. Cute, I know.

### Pods

These are not containers. These are logical groupings of one or more containers to do a unit of work. You're probably never deploying these directly.

### Services

This is like the entrypoint to your application. It can be backed by a number of different pods. This defines the port that you are accessing your application with.

### Ingresses

This is what exposes your service to the real world (oooh scary). So, you can have an ingress that acts as the real entrypoint to your application that gets exposed outside of K8s, then that accesses a service to your application, which accesses other dependencies like databases and such using other services (that aren't connected to an ingress, because you don't want to expose your database to the outside world) that are supported by pod(s). Makes sense? Cool.

### Ingress controllers

Apparently there are many. The "official" Kubernetes one is [`ingress-nginx`](https://kubernetes.github.io/ingress-nginx/) (not to be confused with [`nginx-ingress`](https://www.nginx.com/products/nginx/kubernetes-ingress-controller/) which is another ingress controller by NGINX). AKS uses `ingress-nginx`. Use that one. But also look into using [Traefik](https://docs.traefik.io/providers/kubernetes-crd/). It seems cool.

### Deployments

This is like a group of stuff that gets deployed together. The big thing is that it supports multiple pods as a replica set.

### Stateful sets

This is a deployment with state. Every pod gets its own volume to work with so there's no fighting.

### Persistent Volumes

This is where stuff lives. You probably don't need to create these manually, just know that they exist. Depending on what you use, there is a `StorageClass` that you use to define where you want your storage. This means you can store different things in different places in different ways!

### Persistent Volume Claims

Okay, you do need to create these. Basically you give it some parameters - storage class, size, etc. - and asks Kubernetes to go find you some space in a volume and assign it to you. This you telling K8s "gimme" and K8s always bringing you exactly what you asked for because it's nice like that. Or nothing at all. Deal with it. (⌐■_■)

### Jobs

These are cool! They're like one-off deployments that you can run once or on a schedule to do some work. You totally used them to create collections in your SolrCloud instance.

### Custom Resource Definitions (CRDs)

I don't know a lot about these. All I know is that you can create stuff with custom `apiVersions` that make it look like a standard Kubernetes definition when it's really not because magic. ¯\\\_(ツ)\_/¯

**GO LEARN ABOUT THEM AND STOP ATTRIBUTING THINGS THAT YOU DON'T UNDERSTAND TO MAGIC.**

---

With that out of the way, I'm sure you've got some questions.

### What is this Helm thing?

Helm is like the K8s package manager of sorts. You can download a "chart" which is effectively a recipe to build out a bunch of stuff in your K8s cluster and deploy it all at once. BUT - you can also remove them too! Makes for nice deployments and rollbacks.

### What about Azure Kubernetes Services? Is that a thing?

It's totally a thing. You actually used it to deploy stuff. Basically Azure gives you a "control plane" for free (which is basically the K8s management stuff) and provisions out VMs as your nodes. Connect up with `kubectl`\* and you're off to the races.

AKS also does some neat things where it spins up a separate resource group to manage the Azure services that support your K8s things. For example, when you deploy a PVC, Azure goes and creates a managed disk and mounts it as your volume. When you deploy a service or ingress that's a load balancer, it creates a load balancer. It handles managed identities. IT ALSO CLEANS EVERYTHING UP. Be amazed.

### Do I like Kubernetes?

Yes. Yes you do. You also love the Kubernetes extension in VS Code. It's a game-changer. Also you were addicted to Linux command line via WSL2 and did everything through there along with the VS Code WSL Remote extension. Not sure if that's still true or not but it's the greatest. It'd better be still true. Don't be a slacker. Love your command line and your Linux.

---

Okay, hope that helps! Go off and continue on the trek I blazed for you. Don't die from the pandemic. Eat a vegetable. Make good life choices. Don't let us down.

**With love,**  
June 2020 George
