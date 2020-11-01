---
title: Sitecore and SolrCloud - A Rant
date: 2020-10-26
categories:
  - Sitecore
  - Solr
draft: true
---

For those of you who aren't aware, SolrCloud is the newer way of handling distributed Solr servers. Previously, you would have to pick one of your instances as the master (sic) to handle all of the indexing and then set up multiple read-only slave (double sic) replicas to handle queries. The replicas ping the indexing instance every so often and get updates.

In the new SolrCloud world, all the configuration is managed by a separate service called Zookeeper, then as multiple replicas can be attached to the Zookeeper instance and retrieve its relevant configuration and data is distributed across the replicas based on your replication and sharding settings. I won't get into it more because 1) you can go read all the details in the documentation, and 2) this is supposed to be a rant and not at all educational.

So here's the rant:

If you have multiple Solr instances that can field queries, the ideal way to distribute them is using a load balancer. The load balancer will handle how activity and requests are distributed between each of the nodes. Great, right?

To use SolrCloud in a Sitecore instance, according to the documentation, you should append the `solrCloud=true` token to your Solr connection string and Sitecore will use a different set of logic to accommodate for SolrCloud. Okay cool.

When you set `solrCloud=true` and try to rebuild your search indexes, the first step Sitecore takes is to check the status and health of the cluster. Yeah, that seems logical. In SolrCloud mode, Sitecore pings the SolrCloud Collections API to get the cluster status which lists out the nodes, replicas, and shards of the cluster. An example is shown below. Things are about to take a dark turn.

Sitecore **THEN** takes the output of that and tries to check the status of the individual cores by using the `base_url` property of the response to generate a new URL. The `base_url` property is the URL/hostname of the individual node itself that the shard lives on, not the load balanced system. So, in this case, Sitecore will try to hit a URL like this to check on the status of the core itself:

o hai 404

Now, network security 101 would tell you that if you're using a load balancer, you should expose your load balancer to whatever needs to access it and keep the individual underlying nodes private. Most all clients won't need to access the individual nodes nor do they care how many nodes or what node their data is on.

Unless you're Sitecore.

Sitecore tries to hit all the individual nodes directly through this insane URL generation thing and times out if it can't access it, often causing your `Indexing Manager` to not load at all.

Okay George, now what?

Well, if Sitecore had used dependency injection properly, we could have changed out the implementation of the provider to find the status of the cluster. Alas, it's built according to an interface THEN DIRECTLY INSTANTIATES THE CONCRETE CLASS. \*\*breathes\*\*

The Sitecore Solr implementation is built on SolrNet which I thought, hey, maybe there's something in there for SolrCloud. Turns out, there is. It's in a completely separate library that's not part of Sitecore. It's a completely different implementation that contacts Zookeeper for cluster information, as it should be. Sitecore just sort of bastardized the standard SolrNet library to make it sort of but not really work with SolrCloud.
