import * as L from 'leaflet';


L.Icon.Default.mergeOptions({
	// Erase default options, so that they can be overridden by _initializeOptions if not supplied.
	iconUrl: null,
	iconRetinaUrl: null,
	shadowUrl: null,
	iconSize: null,
	iconAnchor: null,
	popupAnchor: null,
	tooltipAnchor: null,
	shadowSize: null,

	// @option classNamePrefix: String = 'leaflet-default-icon-'
	// Prefix for the classes defined in CSS that contain the Icon options.
	// See the leaflet-defaulticon-compatibility.css file as a starter.
	// Expected suffixes are "icon", "shadow", "popup" and "tooltip".
	classNamePrefix: 'leaflet-default-icon-',
});


L.Icon.Default.include({

	_needsInit: true,

	// Override to make sure options are retrieved from CSS.
	_getIconUrl: function (name) {
		// @option imagePath: String
		// `Icon.Default` will try to auto-detect the location of
		// the blue icon images. If you are placing these images in a
		// non-standard way, set this option to point to the right
		// path, before any marker is added to a map.
		// Caution: do not use this option with inline base64 image(s).
		var imagePath = this.options.imagePath || L.Icon.Default.imagePath || '';
		// Deprecated (IconDefault.imagePath), backwards-compatibility only

		if (this._needsInit) {
			// Modifying imagePath option after _getIconUrl has been called
			// once in this instance of IconDefault will no longer have any
			// effect.
			this._initializeOptions(imagePath);
		}

		return imagePath + L.Icon.prototype._getIconUrl.call(this, name);
	},

	// Initialize all necessary options for this instance.
	_initializeOptions: function (imagePath) {
		this._setOptions('icon', _detectIconOptions, imagePath);
		this._setOptions('shadow', _detectIconOptions, imagePath);
		this._setOptions('popup', _detectDivOverlayOptions);
		this._setOptions('tooltip', _detectDivOverlayOptions);
		this._needsInit = false;
	},

	// Retrieve values from CSS and assign to this instance options.
	_setOptions: function (name, detectorFn, imagePath) {
		var options = this.options,
		    prefix = options.classNamePrefix,
		    optionValues = detectorFn(prefix + name, imagePath);

		for (var optionName in optionValues) {
			options[name + optionName] = options[name + optionName] || optionValues[optionName];
		}
	}

});


// Retrieve icon option values from CSS (icon or shadow).
function _detectIconOptions(className, imagePath) {
	var el = L.DomUtil.create('div',  className, document.body),
	    urlsContainer = _getBkgImageOrCursor(el),
	    urls = _extractUrls(urlsContainer, imagePath),
	    iconX = _getStyleInt(el, 'width'),
	    iconY = _getStyleInt(el, 'height'),
	    anchorNX = _getStyleInt(el, 'margin-left'),
	    anchorNY = _getStyleInt(el, 'margin-top');

	el.parentNode.removeChild(el);

	return {
		Url: urls[0],
		RetinaUrl: urls[1],
		Size: [iconX, iconY],
		Anchor: [-anchorNX, -anchorNY]
	};
}

// Retrieve anchor option values from CSS (popup or tooltip).
function _detectDivOverlayOptions(className) {
	var el = L.DomUtil.create('div', className, document.body),
	    anchorX = _getStyleInt(el, 'margin-left'),
	    anchorY = _getStyleInt(el, 'margin-top');

	el.parentNode.removeChild(el);

	return {
		Anchor: [anchorX, anchorY]
	};
}

// Read the CSS url (could be path or inline base64), may be multiple.
// First: normal icon
// Second: Retina icon
function _extractUrls(urlsContainer, imagePath) {
	var re = /url\(['"]?([^"']*?)['"]?\)/gi, // Match anything between url( and ), possibly with single or double quotes.
	    urls = [],
	    m = re.exec(urlsContainer);

	while (m) {
		// Keep the entire URL from CSS rule, so that each image can have its own full URL.
		// Except in the case imagePath is provided: remove the path part (i.e. keep only the file name).
		urls.push(imagePath ? _stripPath(m[1]) : m[1]);
		m = re.exec(urlsContainer);
	}

	return urls;
}

// Remove anything before the last slash (/) occurrence (inclusive).
// Caution: will give unexpected result if url is inline base64 data
// => do not specify imagePath in that case!
function _stripPath(url) {
	return url.substr(url.lastIndexOf('/') + 1);
}

function _getStyleInt(el, style) {
	return parseInt(_getStyle(el, style), 10);
}

// Factorize style reading fallback for IE8.
function _getStyle(el, style) {
	return L.DomUtil.getStyle(el, style) || L.DomUtil.getStyle(el, _kebabToCamelCase(style));
}

// When Firefox high contrast (colours override) option is enabled,
// "background-image" is overridden by the browser as "none".
// In that case, fallback to "cursor". But keep "background-image"
// as primary source because IE expects cursor URL as relative to HTML page
// instead of relative to CSS file.
function _getBkgImageOrCursor(el) {
	var bkgImage = _getStyle(el, 'background-image');

	return bkgImage && bkgImage !== 'none' ? bkgImage : _getStyle(el, 'cursor');
}

// Convert kebab-case CSS property name to camelCase for IE currentStyle.
function _kebabToCamelCase(prop) {
	return prop.replace(/-(\w)/g, function (str, w) {
		return w.toUpperCase();
	});
}
