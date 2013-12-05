---
layout: post
title: Fixing Asus Xonar XD audio issues on Linux
tags: [linux, troubleshooting]
status: publish
type: post
published: true
meta:
  _edit_last: '1'
---
I recently installed Ubuntu GNOME 13.04 on my new Haswell desktop build which has an Asus Xonar XD sound card.  Everything seemed to run smoothly until I noticed issues with sound on Google Chrome.  Audio from various sources (Flash and HTML5) sounded faster than normal and had a weird pitch. I could also hear some crackling and popping.

Upgrading to chrome-beta fixed the issue with audio being sped up (bug report: [PulseAudio doesn't always use the sample rate reported by the server](https://code.google.com/p/chromium/issues/detail?id=229918)), but I could still hear some cracks and pops.  I tried changing some PulseAudio settings but no luck.

Finally, I bumped into [this](http://forums.linuxmint.com/viewtopic.php?f=42&amp;t=44862) old post on the Linux Mint forums which mentions how the timer-based scheduler behavior in PulseAudio can conflict with some Alsa drivers.  The Asus Xonar XD card uses the snd_virtuoso driver. Immediately after disabling PulseAudio's timer-based scheduling all my audio problems were gone.

Edit */etc/pulse/default.pa* as root with your favorite editor:

```
sudo subl /etc/pulse/default.pa
```


Look for these lines:

```
load-module module-udev-detect use_ucm=0

load-module module-detect
```


Change them to this:

```
load-module module-udev-detect use_ucm=0 tsched=0

load-module module-detect tsched=0
```


Kill PulseAudio (it will automatically restart):

```
pactl exit
```


That's it, haven't had any issues since.  If you have any comments reach me on twitter [@oscrperez](https://twitter.com/oscrperez).