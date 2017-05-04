// ==UserScript==
// @name        Sankakucomplex Compare Images Github
// @namespace   https://github.com/jklgit/
// @description Compare images on github
// @include     https://chan.sankakucomplex.com/post/show/*
// @include     https://chan.sankakucomplex.com/post/delete/*
// @version     1
// @grant       none
// ==/UserScript==

// Add frame do deletion page
var thumbs = document.querySelectorAll('.deleting-post .thumb');
if(thumbs.length === 2){
	
	// Create an iframe
	var iframe = document.createElement('iframe');
	iframe.src = 'https://jklgit.github.io/Image-Comparison-in-Browser/index.html\
		?sid1=' + thumbs[0].getAttribute('id').substr(1) + '&sid2=' + thumbs[1].getAttribute('id').substr(1);
	iframe.style = 'height:700px; margin-left: 2em; width: calc(100% - 4em);';
	
	// Append iframe
	document.getElementById('content').appendChild(iframe);
}

// Add link to post/show/ page
var pool = document.getElementById('add-to-pool');
if(pool){
	var a = document.createElement('a');
	a.innerHTML = 'Compare post content';
	a.target = '_blank';
	a.href = 'https://jklgit.github.io/Image-Comparison-in-Browser/index.html\
		?url1=' + encodeURIComponent(document.location.href);
	
	var li = document.createElement('li');
	li.innerHTML = a.outerHTML;
	pool.parentNode.appendChild(li);
}
