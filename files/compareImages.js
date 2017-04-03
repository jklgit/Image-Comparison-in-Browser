//(function (){

// function main(){

// Global variables
var image1 = {
	dom: null, // dom-object
	j: null, // jQuery-object
	width: 1e10, // orig-width (big number for taking smaller sizes in comparison, if not loaded, smaller number of loaded image will be taken)
	height: 1e10, // orig-height
	dataUrl: '', // base64 dataUrl
	file: null, // dropped file
	zoom: null, // Zoom button jQuery-object
};
var image2 = clone(image1);
var image3 = clone(image1);
var resembleConfig = null;
var play = true;
var displayDetails = true;
var displayExif = true;

(function main() {
	// Bind drag and drop
	dragDropDiv(jQuery('#left'), image1);
	dragDropDiv(jQuery('#mid'), image2);

	// Details and Exif button listener
	displayDetails = jQuery('#displayDetails').is(':checked');
	jQuery('#displayDetails').parent().bind('click', function () {
		displayDetails = this.childNodes[0].checked;
		if (displayDetails) {
			jQuery('.details').show();
		} else {
			jQuery('.details').hide();
		}
	});
	displayExif = jQuery('#displayExif').is(':checked');
	jQuery('#displayExif').parent().bind('click', function () {
		displayExif = this.childNodes[0].checked;
		if (displayExif) {
			jQuery('.exif').show();
		} else {
			jQuery('.exif').hide();
		}
	});

	// Play/Pause button listener
	jQuery('#play').bind('click', function () {
		if (play) {
			play = false;
			jQuery('video').each(function () {
				this.pause();
			});
		} else {
			play = true;
			jQuery('video').each(function () {
				this.play();
			});
		}
	});

	// Zoom button listener
	image1.zoom = jQuery('#left > .zoom').bind('click', function () {
			reset100(1);
		});
	image2.zoom = jQuery('#mid > .zoom').bind('click', function () {
			reset100(2);
		});

	// Stack button listener
	jQuery('#stack').bind('mousedown', function () {
		if ((image1.dom !== null) && (image2.dom !== null)) {
			if (image3.dom !== null) {
				image1.j.parent().css('left', 'calc(100% / 3)');
				image2.j.parent().css('left', '0');
			} else {
				image1.j.parent().css('left', '50%');
				image2.j.parent().css('left', '0');
			}
		}
	})
	.bind('mouseup', function () {
		if ((image1.dom !== null) && (image2.dom !== null)) {
			if (image3.dom !== null) {
				image2.j.parent().css('left', 'calc(100% / 3)');
				image1.j.parent().css('left', '0');
			} else {
				image2.j.parent().css('left', '50%');
				image1.j.parent().css('left', '0');
			}
		}
	})
	.bind('mouseleave', function () {
		if ((image1.dom !== null) && (image2.dom !== null)) {
			if (image3.dom !== null) {
				image2.j.parent().css('left', 'calc(100% / 3)');
				image1.j.parent().css('left', '0');
			} else {
				image2.j.parent().css('left', '50%');
				image1.j.parent().css('left', '0');
			}
		}
	});

	// Listener for resemble
	jQuery('input[name="resemble-method"], input[name="resemble-color"]')
	.each(function (i) {
		// Reset to "nothing" and "flat"
		if((i === 0) || (i === 3)){
			this.checked = true;
		}
		this.disabled = true;
		this.onclick = function () {
			if (resembleConfig !== null) {
				switch (this.parentNode.innerText) {
				case 'Nothing':
					resembleConfig.ignoreNothing();
					break;
				case 'Less':
					resembleConfig.ignoreLess();
					break;
				case 'Colors':
					resembleConfig.ignoreColors();
					break;
				case 'Flat':
					resemble.outputSettings({
						errorType: 'flat'
					});
					resembleConfig.repaint();
					break;
				case 'Move':
					resemble.outputSettings({
						errorType: 'movement'
					});
					resembleConfig.repaint();
					break;
				case 'Flat diff':
					resemble.outputSettings({
						errorType: 'flatDifferenceIntensity'
					});
					resembleConfig.repaint();
					break;
				case 'Move diff':
					resemble.outputSettings({
						errorType: 'movementDifferenceIntensity'
					});
					resembleConfig.repaint();
					break;
				}
			}
		};
	});

	// Add mouselistener for zoom and pan
	jQuery('#left')
	.bind('mousewheel', zoom)
	.bind('dblclick', reset)
	.parent()
	.bind('mousemove', pan)
	.bind('mousedown', panstart)
	.bind('mouseup', panstop)
	.bind('mouseleave', panstop);
	jQuery('#mid')
	.bind('mousewheel', zoom)
	.bind('dblclick', reset);
	jQuery('#right')
	.bind('mousewheel', zoom)
	.bind('dblclick', reset);

	// Pan function
	var panOn = false;
	function pan(event) {
		if (panOn) {
			var x = event.originalEvent.movementX;
			var y = event.originalEvent.movementY;
			if (image1.j !== null) {
				image1.j.css({
					'top': (image1.j.position().top + y) + 'px',
					'left': (image1.j.position().left + x) + 'px',
				});
			}
			if (image1.j !== null) {
				image2.j.css({
					'top': image2.j.position().top + y + 'px',
					'left': image2.j.position().left + x + 'px',
				});
			}
			if (image3.j !== null) {
				image3.j.css({
					'top': image3.j.position().top + y + 'px',
					'left': image3.j.position().left + x + 'px',
				});
			}
		};
	}
	function panstart(event) {
		panOn = true;
		return false;
	}
	function panstop(event) {
		panOn = false;
		return false;
	}

	// Zoom function
	function zoom(event) {
		// Relative scale
		var s = event.deltaY / 20;

		// For pan
		var x_0 = event.offsetX;
		var y_0 = event.offsetY;

		// Zooming along with pan => zooming at hovered point (natural feel)
		if (image1.j !== null) {
			image1.j.css({
				'width': image1.j.width() * (1 + s) + 'px',
				'height': image1.j.height() * (1 + s) + 'px',
				'top': y_0 + (1 + s) * (image1.j.position().top - y_0) + 'px',
				'left': x_0 + (1 + s) * (image1.j.position().left - x_0) + 'px',
			});
		}
		if (image2.j !== null) {
			image2.j.css({
				'width': image2.j.width() * (1 + s) + 'px',
				'height': image2.j.height() * (1 + s) + 'px',
				'top': y_0 + (1 + s) * (image2.j.position().top - y_0) + 'px',
				'left': x_0 + (1 + s) * (image2.j.position().left - x_0) + 'px',
			});
		}
		if (image3.j !== null) {
			image3.j.css({
				'width': image3.j.width() * (1 + s) + 'px',
				'height': image3.j.height() * (1 + s) + 'px',
				'top': y_0 + (1 + s) * (image3.j.position().top - y_0) + 'px',
				'left': x_0 + (1 + s) * (image3.j.position().left - x_0) + 'px',
			});
		}

		updateZoomButton();

		return false;
	};

})();

// Function to clone JS objects
function clone(obj) {
	if (null == obj || "object" != typeof obj)
		return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr))
			copy[attr] = obj[attr];
	}
	return copy;
}

// Add drag drop listener for blocks
function dragDropDiv(div, image) {

	div
	.bind('dragover', function () {
		div.addClass('drag-over');
		return false;
	})
	.bind("dragend", function () {
		div.removeClass('drag-over');
		return false;
	})
	.bind("dragleave", function () {
		div.removeClass('drag-over');
		return false;
	})
	.bind("drop", function (event) {
		var file = event.originalEvent.dataTransfer.files[0];

		if (file) {

			if (file.size > 100 * 1024 * 1024) {
				div.find('.center').html('File too big! Drop another one.');
			} else {
				event.stopPropagation();
				image.file = file;
				handleFile(div, image);
			}

		}
		div.removeClass('drag-over');
		return false;
	});
};

// Reset image scale and pos
function reset() {
	// Parent width, height and ratio (for all images same)
	var w_p = jQuery('.block').width();
	var h_p = jQuery('.block').height();
	var r_p = h_p / w_p;

	// Ratios of the images
	var r_1;
	if (image1.j !== null) { // If image has been calculated
		r_1 = image1.height / image1.width;
	};
	var r_2;
	if (image2.j !== null) { // If image has been calculated
		r_2 = image2.height / image2.width;
	};
	var r_3;
	if (image3.j !== null) { // If image has been calculated
		r_3 = image3.height / image3.width;
	};

	// If parent is more portrait
	if (r_p > r_1) {
		// Maximize width
		if (r_1) {
			image1.j.css({
				'width': w_p,
				'height': w_p * r_1,
				'top': 0.5 * (h_p - w_p * r_1),
				'left': 0
			});
		}
		if (r_2) {
			image2.j.css({
				'width': w_p,
				'height': w_p * r_2,
				'top': 0.5 * (h_p - w_p * r_2),
				'left': 0
			});
		}
	} else {
		// Maximize height
		if (r_1) {
			image1.j.css({
				'width': h_p / r_1,
				'height': h_p,
				'top': 0,
				'left': 0.5 * (w_p - h_p / r_1)
			});
		}
		if (r_2) {
			image2.j.css({
				'width': h_p / r_2,
				'height': h_p,
				'top': 0,
				'left': 0.5 * (w_p - h_p / r_2)
			});
		}
	}

	// Handle video
	if (r_1) {
		image1.j.attr('currentTime', 0);
	}
	if (r_2) {
		image2.j.attr('currentTime', 0);
	}

	reset3();
	updateZoomButton();
}

// Reset third image
function reset3() {
	if (image3.j !== null) {
		image3.j.css({
			'width': image1.j.width(),
			'height': image1.j.height(),
			'top': image1.j.css('top'),
			'left': image1.j.css('left')
		});
	}
}

// Reset image to 100% zoom (Same as zoom-function but relative scale is from image instead of mousewheel)
function reset100(base) {
	// Parent width, height and ratio (for all images same), for natural zoom around center
	var w_p = jQuery('.block').width();
	var h_p = jQuery('.block').height();
	var r_p = h_p / w_p;

	// Relative scale
	var s;
	if (base === 1) {
		s = image1.width / image1.j.width() - 1;
	} else {
		s = image2.width / image2.j.width() - 1;
	}

	// For pan
	var x_0 = w_p / 2;
	var y_0 = h_p / 2;

	// Zooming along with pan => zooming at hovered point (natural feel)
	if (image1.j !== null) {
		image1.j.css({
			'width': image1.j.width() * (1 + s) + 'px',
			'height': image1.j.height() * (1 + s) + 'px',
			'top': y_0 + (1 + s) * (image1.j.position().top - y_0) + 'px',
			'left': x_0 + (1 + s) * (image1.j.position().left - x_0) + 'px',
		});
	}
	if (image2.j !== null) {
		image2.j.css({
			'width': image2.j.width() * (1 + s) + 'px',
			'height': image2.j.height() * (1 + s) + 'px',
			'top': y_0 + (1 + s) * (image2.j.position().top - y_0) + 'px',
			'left': x_0 + (1 + s) * (image2.j.position().left - x_0) + 'px',
		});
	}
	if (image3.j !== null) {
		image3.j.css({
			'width': image3.j.width() * (1 + s) + 'px',
			'height': image3.j.height() * (1 + s) + 'px',
			'top': y_0 + (1 + s) * (image3.j.position().top - y_0) + 'px',
			'left': x_0 + (1 + s) * (image3.j.position().left - x_0) + 'px',
		});
	}

	updateZoomButton();

	return false;
};

// Zoom button update to current zoom
function updateZoomButton() {
	if (image1.j !== null) {
		image1.zoom.html(Math.round(image1.j.width() / image1.width * 1000) / 10 + ' %');
	}
	if (image2.j !== null) {
		image2.zoom.html(Math.round(image2.j.width() / image2.width * 1000) / 10 + ' %');
	}
}

// Handle dropped file
function handleFile(div, image) {

	// Remove old details and image
	div.find('.details').remove();
	div.find('.main').remove();
	div.find('.exif').remove();
	div.find('.center').html('Reading data...');
	image3.dom = null;
	image3.j = null;

	// Append details
	var details = document.createElement('div');
	details.setAttribute('class', 'details');
	details.innerHTML = image.file.name + '<br>\
		Filesize: ' + image.file.size + ' Bytes<br>\
		Filetype: ' + image.file.type;
	div.append(details);
	if (!displayDetails) {
		jQuery('.details').hide();
	}

	// Append EXIF
	EXIF.getData(image.file, function () {
		var text = EXIF.pretty(this).split('\n').join('<br>'); ;
		if (text !== '') {
			div.append(jQuery('<div class="exif">' + text + '</div>'));
			if (!displayExif) {
				jQuery('.exif').hide();
			}
		}
	});

	// Create dom element for type
	switch (image.file.type) {
	case 'image/jpeg':
	case 'image/png':
	case 'image/gif':
		image.dom = new Image();
		break;

	case 'video/webm':
	case 'video/mp4':
		image.dom = document.createElement('video');
		image.dom.setAttribute('autoplay', play);
		image.dom.setAttribute('loop', true);
		image.dom.muted = true;

		// Activate play/pause button
		jQuery('#play').show();

		break;
	}

	// Append file and compare on load
	if (image.dom !== null) {
		image.j = jQuery(image.dom);
		image.dom.setAttribute('class', 'main');
		var fileReader = new FileReader();

		fileReader.onload = function (event) {
			if (image.file.type.startsWith('image')) {
				image.dom.onload = function () {
					image.width = image.dom.width;
					image.height = image.dom.height;
					details.innerHTML = details.innerHTML + '<br>\
						Dimension: ' + image.width + 'x' + image.height;
					div.find('.center').remove();
					image.zoom.show();
					reset();
					compareImages();
				};
			} else {
				image.dom.addEventListener("loadedmetadata", function (e) {
					image.width = this.videoWidth,
					image.height = this.videoHeight;
					details.innerHTML = details.innerHTML + '<br>\
						Dimension: ' + image.width + 'x' + image.height;
					div.find('.center').remove();
					image.zoom.show();
					reset();
					compareImages();
				}, false);
			}
			div.append(image.dom);
			image.dom.src = event.target.result;
		};

		fileReader.readAsDataURL(image.file);
	}
	else{
		div.find('.center').html('Not a supported image or video file!');
	}
}

function compareImages() {
	if ((image1.dom !== null) && (image2.dom !== null)) {
		if (((image1.file.type === 'image/jpeg') || (image1.file.type === 'image/png')) &&
			((image2.file.type === 'image/jpeg') || (image2.file.type === 'image/png'))) {

			// Compare images with resemble
			if (resembleConfig === null) {
				resemble.outputSettings({
					largeImageThreshold: 0,
					transparency: 0.3
				});
			}

			resembleConfig = resemble(image1.file).compareTo(image2.file).onComplete(function (data) {
					// Image 3 Loaded
					image3.dom = document.querySelector('#right > .main');
					image3.j = jQuery(image3.dom).attr('src', data.getImageDataUrl());
					image3.width = image1.width;
					image3.height = image1.height;
					jQuery('#right > .details').html('Mismatch: ' + data.misMatchPercentage + ' %');
					jQuery('input[name="resemble-method"], input[name="resemble-color"]').each(function () {
						this.disabled = false;
					});

					// Activate third panel
					if (jQuery('#right').is(':visible')) {
						reset3();
					} else {
						jQuery('#left').css({
							'left': '0',
							'width': 'calc(100%/3 - 3px)'
						});
						jQuery('#mid').css({
							'left': 'calc(100%/3)',
							'width': 'calc(100%/3 - 3px)'
						});
						jQuery('#right').show()
						reset();
					}
				});

		}
		else{
			// Deactivate third panel
			jQuery('#left').css({
				'left': '0',
				'width': 'calc(50% - 3px)'
			});
			jQuery('#mid').css({
				'left': '50%',
				'width': 'calc(50% - 3px)'
			});
			jQuery('#right').hide()
			reset();
			image3.j = null;
			image3.dom = null;
		}
	}
}

// };

//})();
