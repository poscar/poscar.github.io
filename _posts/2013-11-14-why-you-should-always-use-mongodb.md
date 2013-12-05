---
layout: post
title: Why You Should Always Use MongoDB
tags: [mongodb, ramblings]
status: publish
type: post
published: true
meta:
  _edit_last: '1'
---
Truth is you shouldn't always use MongoDB.  But saying to [never use it](http://www.sarahmei.com/blog/2013/11/11/why-you-should-never-use-mongodb/) is a bit extreme.

- If your application needs full <a title="ACID" href="http://en.wikipedia.org/wiki/ACID" target="_blank">ACID</a> guarantees, don't use MongoDB.
- If you're not willing to learn MongoDB best practices, how to structure your data, and how to architect your application to work with your database, don't use MongoDB.
- If you can't take any risks and can't afford to learn from failure, don't use MongoDB or any technology which doesn't have a long proven track record.
- If you don't have any users yet and your main/only reason for using MongoDB is scale, don't use MongoDB.


We've been working with MongoDB on a new application for about six months now.  So far MongoDB does what we need it to do.  We are using a full JavaScript stack. MongoDB has given us a lot of flexibility and allowed us to move very quickly.  Our application is partially distributed and can work offline.  We keep a lot of data cached on the clients and can easily tolerate server and database failures.

One of the common themes in our line of work is change.  MongoDB is a great fit for us right now.  Our application is rapidly changing, our data is rapidly changing.  Will MongoDB do the job a year from now? Two years from now?  Maybe, maybe not.  If you're able to adapt and change this shouldn't be an issue.

Don't be afraid of painting yourself into a corner, just make sure you're not too high off the ground and there's a window to jump out of.

Send comments and/or hatespeech my way: [@oscrperez](https://twitter.com/oscrperez).
