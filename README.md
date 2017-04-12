# Image Comparison Tool for your Browser

[Use it here!](https://jklgit.github.io/Image-Comparison-in-Browser/index.html)

Just drag and drop image or video files to compare. Files need to be smaller than 100 MB.

# Advanced Use

You can drag and drop images directly from your browser as well. But it is not always possible to read exif and pixel data, because not all domains allow CORS policy. One domain which allows reading out data from images is twitter.com for example.

It is also possible to use arguments in the link to directly load a URL after the page is loaded. For example https://jklgit.github.io/Image-Comparison-in-Browser/index.html?sid1=5981914 will load an image with the post id 5981914 from chan.sankakucomplex.com. Following arguments can be used:

* url1: Url to load for the left panel. Use decodeURIComponent, when setting this parameter.
* url2: Url to load for the right panel. Use decodeURIComponent, when setting this parameter.
* sid1: Post id from chan.sankakucomplex.com for the left panel.
* sid2: Post id from chan.sankakucomplex.com for the right panel.

# Credits

This program utilizes:

* [resemble.js](https://github.com/Huddle/Resemble.js)
* [exif.js](https://github.com/exif-js/exif-js)
* [jquery](https://github.com/jquery/jquery)
* [jquery-mousewheel](https://github.com/jquery/jquery-mousewheel)
