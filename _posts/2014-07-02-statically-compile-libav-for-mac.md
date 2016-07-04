---
layout: post
title: Statically Compile Libav for Mac OS X
tags: [libav, mac]
status: publish
type: post
published: true
meta:
  _edit_last: '1'
---

[Libav](https://libav.org/) is a cross-platform open source multimedia library that supports a large number of media formats.  I am using the tools that come with Libav in an open source project currently under development.  Static builds of the Libav tools will be included in the project so that users don't have to go around fetching dependencies.

Static builds for for Linux and Windows [already](http://johnvansickle.com/libav/) [exist](http://win32.libav.org/releases/).  Sadly, static Mac builds were nowhere to be found, so I decided to take a shot at building them myself.

Google turned up some useful information on how to [build Libav for OS X](http://superuser.com/questions/568464/install-latest-libav-avconv-on-osx), but these instructions resulted in binaries with a lot of dylib dependencies as shown by the output of `otool -L`:

```
/usr/local/lib/libavdevice.54.dylib (compatibility version 54.0.0, current version 54.0.0)
/usr/local/lib/libavfilter.4.dylib (compatibility version 4.0.0, current version 4.2.0)
/usr/local/lib/libavformat.55.dylib (compatibility version 55.0.0, current version 55.12.0)
/usr/local/lib/libavresample.1.dylib (compatibility version 1.0.0, current version 1.1.0)
/usr/local/lib/libavcodec.55.dylib (compatibility version 55.0.0, current version 55.34.1)
/usr/local/lib/libswscale.2.dylib (compatibility version 2.0.0, current version 2.1.2)
/usr/local/lib/libavutil.53.dylib (compatibility version 53.0.0, current version 53.3.0)
/opt/local/lib/libnettle.4.dylib (compatibility version 4.0.0, current version 4.7.0)
/opt/local/lib/libhogweed.2.dylib (compatibility version 2.0.0, current version 2.5.0)
/opt/local/lib/libgmp.10.dylib (compatibility version 13.0.0, current version 13.0.0)
/opt/local/lib/libxvidcore.4.dylib (compatibility version 4.0.0, current version 4.3.0)
/opt/local/lib/libx264.142.dylib (compatibility version 0.0.0, current version 0.0.0)
/opt/local/lib/libvorbisenc.2.dylib (compatibility version 3.0.0, current version 3.10.0)
/opt/local/lib/libvorbis.0.dylib (compatibility version 5.0.0, current version 5.7.0)
/opt/local/lib/libogg.0.dylib (compatibility version 9.0.0, current version 9.1.0)
/opt/local/lib/libtheoraenc.1.dylib (compatibility version 3.0.0, current version 3.2.0)
/opt/local/lib/libtheoradec.1.dylib (compatibility version 3.0.0, current version 3.4.0)
/opt/local/lib/libspeex.1.dylib (compatibility version 7.0.0, current version 7.0.0)
/opt/local/lib/libopenjpeg.1.dylib (compatibility version 7.0.0, current version 7.0.0)
/opt/local/lib/libopencore-amrwb.0.dylib (compatibility version 1.0.0, current version 1.3.0)
/opt/local/lib/libopencore-amrnb.0.dylib (compatibility version 1.0.0, current version 1.3.0)
/opt/local/lib/libmp3lame.0.dylib (compatibility version 1.0.0, current version 1.0.0)
/opt/local/lib/libfreetype.6.dylib (compatibility version 18.0.0, current version 18.2.0)
/opt/local/lib/libfaac.0.dylib (compatibility version 1.0.0, current version 1.0.0)
/opt/local/lib/libgnutls.28.dylib (compatibility version 50.0.0, current version 50.2.0)
/usr/lib/libSystem.B.dylib (compatibility version 1.0.0, current version 1197.1.1)
/opt/local/lib/libbz2.1.0.dylib (compatibility version 1.0.0, current version 1.0.6)
/opt/local/lib/libz.1.dylib (compatibility version 1.0.0, current version 1.2.8)
```

It should be easy enough to force static build during the configuration step to get rid of these dependencies, right?  Nope. The default compiler included with the [command line tools for Xcode](https://developer.apple.com/downloads/index.action) fails when the static build options are specified.  To add to the pain, OS X prefers dynamically linked libraries. Even with a working compiler, the linker always chooses dynamic (.dylib) versions over the static (.a) ones.

In order to get everything working I had to use gcc from [MacPorts](http://www.macports.org/), modify the configuration options, and relocate .dylib files so that the linker didn't find them.  Steps were as follows:

1. Install gcc from MacPorts:

	``` $ sudo ports install gcc48 ```

2. Install Libav dependencies if you haven't done so already:

	``` $ sudo port install yasm zlib bzip2 faac lame speex libogg libvorbis libtheora libvpx x264 XviD openjpeg15 opencore-amr freetype ```

3. Configure Libav with the following command:

	``` $ ./configure --enable-gpl --enable-libx264 --enable-libxvid --enable-version3 --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-nonfree --enable-libmp3lame --enable-libspeex --enable-libvorbis --enable-libtheora --enable-libvpx --enable-libopenjpeg --enable-libfreetype --enable-doc --enable-static --disable-shared --prefix=BUILD/ --extra-cflags="/opt/local/lib/*.a" --extra-ldflags="-static-libgcc /opt/local/lib/*.a" --cc=/opt/local/bin/gcc-mp-4.8 ```

4. Build Libav

	``` $ make && make install ```

5. Verify linking

	``` $ otool -L BUILD/avconv ```

	This will show that the binaries are still being linked against dynamic libraries:

	``` /opt/local/lib/libxvidcore.4.dylib (compatibility version 4.0.0, current version 4.3.0)
/opt/local/lib/libx264.142.dylib (compatibility version 0.0.0, current version 0.0.0)
/opt/local/lib/libvorbisenc.2.dylib (compatibility version 3.0.0, current version 3.10.0)
/opt/local/lib/libvorbis.0.dylib (compatibility version 5.0.0, current version 5.7.0)
/opt/local/lib/libogg.0.dylib (compatibility version 9.0.0, current version 9.1.0)
/opt/local/lib/libtheoraenc.1.dylib (compatibility version 3.0.0, current version 3.2.0)
/opt/local/lib/libtheoradec.1.dylib (compatibility version 3.0.0, current version 3.4.0)
/opt/local/lib/libspeex.1.dylib (compatibility version 7.0.0, current version 7.0.0)
/opt/local/lib/libopenjpeg.1.dylib (compatibility version 7.0.0, current version 7.0.0)
/opt/local/lib/libopencore-amrwb.0.dylib (compatibility version 1.0.0, current version 1.3.0)
/opt/local/lib/libopencore-amrnb.0.dylib (compatibility version 1.0.0, current version 1.3.0)
/opt/local/lib/libmp3lame.0.dylib (compatibility version 1.0.0, current version 1.0.0)
/opt/local/lib/libfreetype.6.dylib (compatibility version 18.0.0, current version 18.2.0)
/opt/local/lib/libbz2.1.0.dylib (compatibility version 1.0.0, current version 1.0.6)
/opt/local/lib/libz.1.dylib (compatibility version 1.0.0, current version 1.2.8)
/usr/lib/libSystem.B.dylib (compatibility version 1.0.0, current version 1197.1.1) ```

6. We need to move out the third party .dylib files from their locations so that the linker doesn't pick them up. Don't forget to move them back once you're done:

	``` $ sudo mkdir /sharedlibs
$ sudo mv /opt/local/lib/libxvidcore.*.dylib /opt/local/lib/libx264.*.dylib /opt/local/lib/libvorbisenc.*.dylib /opt/local/lib/libvorbis.*.dylib /opt/local/lib/libogg.*.dylib /opt/local/lib/libtheoraenc.*.dylib /opt/local/lib/libtheoradec.*.dylib /opt/local/lib/libspeex.*.dylib /opt/local/lib/libopenjpeg.*.dylib /opt/local/lib/libopencore-amrwb.*.dylib /opt/local/lib/libopencore-amrnb.*.dylib /opt/local/lib/libmp3lame.*.dylib /opt/local/lib/libfreetype.*.dylib /opt/local/lib/libbz2.*.dylib /opt/local/lib/libz.*.dylib /sharedlibs/ ```

7. Repeat steps **3**, **4**, and **5**.  The otool output should no longer contain third party .dylib dependencies:

	``` /usr/lib/libSystem.B.dylib (compatibility version 1.0.0, current version 1197.1.1) ```

If you don't want to build Libav yourself, download it here:

[Static build of Libav 10.1 for Mac OS X](https://dl.dropboxusercontent.com/s/mmw04ilcmm7jmmo/libav_10.1_osx_static.zip) (SHA1: 2f62024d409168f02beb27cc38c84f1e95515fca)
