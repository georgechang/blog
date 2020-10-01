---
title: Sitecore, URL Rewrites, and the "Failed" JS Dialog
date: 2016-05-02
categories:
  - Sitecore
  - JavaScript
---

Recently for our new public website, we encountered a bit of an issue with the Sitecore back-end that didn't really have a descriptive error. In fact, there were a number of symptoms that were a bit unexplained but the most frequently encountered one was this "Failed" JavaScript dialog that would come up when expanding something in a tree view in the Content Editor:

![failed-600x488](/content/images/2018/04/failed-600x488.png)

If you check the browser console, you'll see that there is a 500 error when trying to hit `/sitecore/shell/controls/treeviewex/treeviewex.aspx?treeid=…`

If you hit that link directly, you're greeted with this friendly "Null ids are not allowed. Parameter name: name" error:

![null-ids-600x336](/content/images/2018/04/null-ids-600x336.png)

Additionally, if you open the Experience Editor, you'll get a far more frightening error "A serious error occurred please contact the administrator":

![error-600x219](/content/images/2018/04/error-600x219.png)

If that wasn't enough, none of the links in the Control Panel work. So there's that.

Right about now, you're pretty upset at your SEO person for making you do this. You start to question the purpose of SEO and to some point, life itself. I'm here to tell you it'll be okay. Here's why:

It turns out, the Sitecore back-end doesn't like 301 redirects much - specifically for us, it was with the default "Enforce lowercase URLs" rule in the IIS URL Rewrite module. By default, the rule matches everything using the expression [A-Z]. However, while only a case change, something in the Sitecore back-end doesn't particularly like the redirect - I'm guessing maybe a pipeline processor somewhere that gets misfired or fired multiple times.

So how do we fix this? Well, for starters, your [/sitecore URLs shouldn't be accessible on your content delivery servers](https://doc.sitecore.net/sitecore_experience_platform/setting_up__maintaining/security_hardening/configuring/deny_anonymous_users_access_to_a_folder) to begin with, so making sure that's correct will get you started off. If you have a shared CM/CD environment that you're testing on or working locally, you'll want to add an exclusion filter for a few key Sitecore-related URLs:

- Anything under `/sitecore`
- Anything with the query string `sc_mode` or `sc_debug`
- Anything under `/-/speak`

So what happens is you wind up with a rule in your web.config looking like this:

```xml
<rule name="LowerCaseRule" stopProcessing="true">
  <match url="[A-Z]" ignoreCase="false" />
  <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
    <add input="{URL}" pattern="WebResource.axd" negate="true" />
    <add input="{URL}" pattern="(\/sitecore)|(\/(.*\?sc_mode=edit))|(\/-\/speak)" negate="true" />
  </conditions>
  <action type="Redirect" url="{ToLower:{URL}}" />
</rule>
```

With that, your Sitecore back-end has been restored to normal working order. Go high-five your nearest SEO person!
