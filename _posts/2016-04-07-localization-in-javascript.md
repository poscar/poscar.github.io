---
layout: post
title: Localization in JavaScript
tags: [js, javascript, localization, l20n, l10n]
status: publish
type: post
published: true
meta:
  _edit_last: '1'
---

Localization is one of those topics most software developers rarely think about. Developers often deal with localization after their products are mature and shipping. This makes the task of localizing apps tedious and repetitive by de-facto. Just picture yourself going through your code hunting for strings... not fun. On top of that, figuring out which format to store translations, how to map strings to translations, how to deal with plurals, complicated languages (e.g. Polish), etc, makes localization even more annoying.

In the world of JavaScript there is no standard way to perform localization. There are various libraries such as: [i18next](https://github.com/i18next/i18next), [l10n.js](https://github.com/eligrey/l10n.js/), [L20n](https://github.com/l20n/l20n.js), and [Polyglot.js](http://airbnb.io/polyglot.js/). The problem is that most of these libraries are either too simplistic, overly complicated, or lack tooling.

Out of all the JavaScript libraries, I found [L20n](http://www.l20n.org/) by
Mozilla to be the most complete, mature, and easy to use. L20n was originally developed to solve localization for Firefox OS apps. Even though Firefox OS
has been discontinued, Mozilla has kept developing and improving L20n. In this post we will go over how L20n can help us localize websites, single page apps, and server-side generated content. The L20n project provides a JavaScript library and describes a new file format. I've found the L20n format to be simple for basic use cases, while also allowing for complex translations whenever necessary.

L20n makes it easy to localize websites and single page apps. To start using L20n, simply include the library, set the default language, and include your language files. Here's an example:

```
<html>
  <head>
    <meta name="defaultLanguage" content="en-US">
    <meta name="availableLanguages" content="de, en-US, es, fr, pl">
    <link rel="localization" href="locales/base.{locale}.l20n">
    <link rel="localization" href="locales/webpage.{locale}.l20n">
    <script defer src="vendor/l20n.min.js"></script>
  </head>
  <body>
    <h1 data-l10n-id="websiteIndexHeader"></h1>
    <p data-l10n-id="websiteIndexParagraph"></p>
    <p data-l10n-id="websiteIndexFooter" data-l10n-args="{\"year\":\"2016\", \"name\":\"John Doe\"}"></p>
  </body>
</html>
```

The syntax of L20n files looks as follows (this is an example of a Polish translation from the L20n repo):

```
<brandName {
  nominative: "Firefox",
  genitive: "Firefoksa",
  dative: "Firefoksowi",
  accusative: "Firefoksa",
  instrumental: "Firefoksem",
  locative: "Firefoksie"
}>
<about "O {{ brandName.locative }}">
<preferences "Preferencje {{ brandName.genitive }}">
```

You can tinker with L20n live [here](http://l20n.github.io/tinker/).

For the HTML example we showed above, a simple L20n file would look as follows:

```
<websiteIndexHeader "Welcome to My Website">
<websiteIndexParagraph "This is the text in the welcoming paragraph for my awesome website.">
<websiteIndexFooter "(c) {{ $year }} {{ $name }}">
```

Most web apps rely heavily on JavaScript to populate and modify the DOM. L20n provides the **document.l10n.formatValues** and **document.l10n.setAttributes** APIs. The **formatValues** API allows us to get translated strings directly. The **setAttribuets** API allows us to set the data-l10n-id and data-l10n-args attributes on a DOM element. We can use these APIs as follows:

```
// formatValues example
document.l10n.formatValues('websiteIndexHeader', ['websiteIndexFooter', {year: '2016', name: 'John Doe'}]).then(function (strings) {
  console.log('header: %s', strings[0]);
  console.log('footer: %s', strings[1]);
});

// setAttributes example
var element = document.querySelector('#targetElementId');
document.l10n.setAttributes(element, 'websiteIndexFooter', {year: '2016', name: 'John Doe'});
```

If you're using JQuery, you could use a plugin like the one shown in the snippet below. This plugin allows you to set localization attributes directly on JQuery objects:

```
$.fn.setL10nData = function (id, args) {
  return this.each(function () {
    document.l10n.setAttributes(this, id, args);
  });
};
```

On the server side, L20n provides an API that can be used from NodeJS. Here's an example for translating some text using the L20n [module](https://www.npmjs.com/package/l20n)):

```
var l20n = require('l20n');

// Initialize l20n environment.
var l20nEnv = new l20n.Env(l20n.fetchResource);

// Declare an array with the paths to your l20n files
var l20nFiles = ['./locales/strings.{locale}.l20n'];

// Create context for english language.
var englishContext = l20nEnv.createContext([{code: 'en-US'}], l20nFiles);

// Create context for spanish language
var spanishContext = l20nEnv.createContext([{code: 'es'}], l20nFiles);

// Display english string.
englishContext.formatValues('serverWelcomeText').then(function (translatedStrings) {
  console.log('english: %s', translatedStrings[0]);
});

// Display spanish string.
spanishContext.formatValues('serverWelcomeText').then(function (translatedStrings) {
  console.log('spanish: %s', translatedStrings[0]);
});
```

There is also a L20n parser and implementation [for Python](https://github.com/l20n/python-l20n/). Hopefully there will be L20n implementations for other platforms in the future, as this will simplify the localization process for cross-platform apps.

Overall, L20n improves localization and makes it easy for websites and JavaScript apps to be localized. L20n is not perfect, but with more users and contributors I have no doubt it will become the standard way of localizing the web.

Feel free to reach out with questions or comments: [@oscrperez](https://www.twiter.com/oscrperez).

References:

- [L20n](http://www.l20n.org/)
- [L20n HTML Docs](https://github.com/l20n/l20n.js/blob/v3.x/docs/html.md)
- [L20n DOM API Docs](https://github.com/l20n/l20n.js/blob/v3.x/docs/view.md)
- [L20n NodeJS API Docs](https://github.com/l20n/l20n.js/blob/v3.x/docs/node.md)
- [JQuery Plugins](http://learn.jquery.com/plugins/basic-plugin-creation)
