---
layout: post
title: Objects and Encapsulation in JavaScript
tags: []
status: draft
type: post
published: false
meta:
  _edit_last: '1'
---
A few months ago I started developing web applications full time.  It was my first encounter with full-stack JavaScript development.  It forced me to change the mindset and habits that I had built over the years doing object oriented design and development.

In JavaScript functions are first class citizens, they can be created anywhere. Inside other functions, assigned to variables, passed as arguments, and returned from functions. JavaScript functions also act as objects, which means you can assign properties to it.  Let's also not forget about a function prototype, which allows us to define properties shared across instances of a function.  Yes, a function can be a constructor and we can make instances of it.

Hopefully, you're still following along. In a nutshell, javascript allows functions to be used in many different ways.  This gives us flexibility in the way we implement design patterns, but it also causes a lot of confusion.  It is difficult to know the right and wrong ways of structuring our code.

The following are different methods that I've used over the past few months to hide implementation details for JavaScript modules/classes in Node.Js and keep our code organized. Most of it is valid for client side as well.

One of our main goals is to not fight the functional aspect of JavaScript and still structure or code in a clean and logical manner.
