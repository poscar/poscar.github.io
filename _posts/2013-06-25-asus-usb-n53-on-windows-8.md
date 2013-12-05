---
layout: post
title: ASUS USB-N53 on Windows 8
tags: [windows, troubleshooting]
status: publish
type: post
published: true
meta:
  _edit_last: '1'
---
I have an ASUS USB-N53 wireless adapter which would take a few minutes to connect after start up under Windows 8.  This problem was not observed with this adapter on the old machine which was running Windows 7.  After trying the regular steps of clearing settings, disabling/enabling the adapter, re-installing the device, etc, the cause of the problem turned out to be the default drivers from Microsoft.

Installing the drivers [here on the official ASUS support page](https://www.asus.com/Networking/USBN53/#support_Download) (version 1.0.14.0 as of this post) solved this issue, the adapter now connects right away. :)
