import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // CSS version that re-uses images from ~leaflet package.
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';


var paris = [48.86, 2.35];
var map = L.map('map').setView(paris, 11).panBy([0, -25]);

// Add a Marker with default icon to demonstrate the effect of the compatibility plugin.
L.marker(paris).addTo(map).bindTooltip('Marker here', {
	permanent: true,
}).bindPopup('My popup');

// Add a Circle Marker to make sure the previous Marker is at the correct position.
L.circleMarker(paris).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// Fill the page information.
getElById('demoVersion').innerHTML = DEMO_VERSION; // To be defined at compile time.
getElById('loader').innerHTML = ASSET_LOADER; // To be defined at compile time.

// Retrieve the Marker icon and shadow images src attribute values.
var iconSrc = document.querySelector('.leaflet-marker-icon').src;
getElById('iconImg').src = iconSrc;
getElById('iconSrc').innerHTML = iconSrc || '(not found)';

var shadowSrc = document.querySelector('.leaflet-marker-shadow').src;
getElById('shadowImg').src = shadowSrc;
getElById('shadowSrc').innerHTML = shadowSrc || '(not found)';

/**
 * Retrieve the Element with specified id in document.
 * @param {String} id of the Element to look for in the document.
 */
function getElById(id) {
	return document.getElementById(id);
}
