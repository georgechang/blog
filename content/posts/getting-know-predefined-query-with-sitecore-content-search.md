---
title: Getting to Know PredefinedQuery with Sitecore Content Search
date: 2017-09-06
categories:
  - Sitecore
---

Recently I've been working a lot with the Sitecore Content Search API and found myself writing a lot of code like this:

`var allTheThings = context.GetQueryable<Thing>().Where(x => x.TemplateId == Constants.Thing.TemplateId && x.IsSearchable);`

As we're always looking for better ways to do things around here and my laziness started to prevail, I thought, "there has got to be a way to do this where I don't have to keep checking for template congruence in my search queries…." The obvious subsequent thought was "I should write something to do this for me…"

Then one fateful day, I fired up the Sitecore LINQ Scratchpad (`/sitecore/admin/linqscratchpad.aspx` for the uninitiated) for something unrelated and noticed a line in the boilerplate code that I hadn't paid attention to previously:

![predefinedquery](/content/images/2018/04/predefinedquery.png)

Wait, what is this `PredefinedQuery` attribute?

Through some digging and reflection (both the soul-searching kind and the decompiler kind) as well as some trial and error, it turns out that Sitecore already wrote something to do what I wanted for me (thanks Sitecore!).

So here's what it does. When `context.GetQueryable<T>()` gets called, the method uses reflection against the specified generic type (in my example above, that would be `Thing`) and checks to see if there are `[PredefinedQuery]`  attributes on the class. The `[PredefinedQuery]`  attribute translates the parameters into a lambda expression (likely using a `PredicateBuilder`) that `GetQueryable<T>` applies to the `IQueryable` that it returns.

So my example above can be rewritten using the `[PredefinedQuery]`  attribute like so:

```csharp
[PredefinedQuery("TemplateId", ComparisonType.Equal, Constants.Thing.TemplateId, typeof(Guid))]
public class Thing
{
  [IndexField("_template")]
  public Guid TemplateId {get; set; }

  [IndexField("isSearchable_b")]
  public bool IsSearchable {get; set;}
}
```

`var allTheThings = context.GetQueryable<Thing>().Where(x => x.IsSearchable);`

When `context.GetQueryable<Thing>()` gets called, it basically returns the equivalent of an instance of `IQueryable<Thing> .Where(x => x.TemplateId == Constants.Thing.TemplateId)` so it's one less check I need to do every time I use my Thing class for search results.

Before you go rush off to play with this, there are a few things to be aware of…

The first parameter is the string value of the name of the property on the class and not the search index field name - this means in this case it's `TemplateId` and not `_template`. This also means that any field you want to use in a `[PredefinedQuery]` attribute needs to be a property on the class and mapped to the appropriate field in the search index with the `[IndexField]` attribute.

The second parameter defines the comparison type according to an enum. The available values are below:

- `Equal`
- `LessThan`
- `LessThanOrEqual`
- `GreaterThan`
- `GreaterThanOrEqual`
- `OrderBy`
- `Like`
- `NotEqual`
- `Contains`
- `StartsWith`
- `EndsWith`
- `Matches`
- `MatchWildcard`

There is also an optional 4th parameter that you can use to specify the type of the value (the 3rd parameter). In my example I had a property in a Constants class that is a string but I can let the query know that the string should be parsed into a Guid.

Eagle-eyed readers may have noticed that I used plurals in talking about the `[PredefinedQuery]` attribute earlier. That's because, you guessed it, you can have multiple instances of it on a single class. They stack with what's essentially an AND operator as it creates a `.Where()` statement for each instance of the `[PredefinedQuery]` attribute and chains them together. With that in mind, let's revisit the example once more.

```csharp
[PredefinedQuery("TemplateId", ComparisonType.Equal, Constants.Thing.TemplateId, typeof(Guid))]
[PredefinedQuery("IsSearchable", ComparisonType.Equal, true, typeof(bool))]
public class Thing
{
  [IndexField("_template")]
  public Guid TemplateId {get; set; }

  [IndexField("isSearchable_b")]
  public bool IsSearchable {get; set;}
}
```

`var allTheThings = context.GetQueryable<Thing>();`

Look ma, no `.Where()` statement! Now every time I use `GetQueryable` on the `Thing` class, I'll always get objects returned that match the correct `TemplateId` and also have the `IsSearchable` flag marked as true. Those are conditions I no longer have to check every time I need to execute a search as they'll already be built in to the `IQueryable` that gets returned to me. Neat, right?

The best part is that because these lambda operations are happening on an `IQueryable`, the code still gets compiled down to a single query when the search is executed even if you add additional LINQ operators after `GetQueryable<T>()`. Now, go search all the things! (with responsible type-checking)
