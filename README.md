# leaflet-defaulticon-compatibility
Retrieve all Leaflet Default Icon options from CSS, in particular all icon images URL's, to improve compatibility with bundlers and frameworks that modify URL's in CSS.

Note: here, "_compatibility_" does not refer to _browser_ compatibility, but with build engines and frameworks that modify URL's in CSS, which often conflicts with Leaflet built-in Default Icon images automatic management. See [issue Leaflet/Leaflet#4698](https://github.com/Leaflet/Leaflet/issues/4968) for more details.


## Usage

Load this plugin CSS and JS files _after_ Leaflet CSS and JS. Then the Leaflet default icon should automatically work again, even if your build engine or framework modifies the URL's in CSS, typically:
- webpack with [style-loader](https://github.com/webpack-contrib/style-loader) + [css-loader](https://github.com/webpack-contrib/css-loader) + [file-loader](https://github.com/webpack-contrib/file-loader) or [url-loader](https://github.com/webpack-contrib/url-loader)
- Rails with [Asset Pipeline](http://guides.rubyonrails.org/asset_pipeline.html#what-is-fingerprinting-and-why-should-i-care-questionmark)
- Django with [pipeline](https://github.com/jazzband/django-pipeline)

For example for webpack with style-loader + css-loader + file-loader:

```javascript
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
```


### CSS file

This plugin provides 2 similar CSS files:

- `leaflet-defaulticon-compatibility.css`: use it by default.
- `leaflet-defaulticon-compatibility.webpack.css`: alternative for webpack / bundlers that understand the `~leaflet` syntax to navigate to other packages in `node_modules`. This avoids duplicating the `images/marker-icon.png` file from `leaflet.css`, hence saving some bytes, especially when the images is inlined as DataURI/base64 (even though with gzip compression this should not be an issue).


## Warning: Data URI (base64) images performance

Some bundlers automatically replace `url(path)` in CSS by [Data URI](https://en.wikipedia.org/wiki/Data_URI_scheme) (aka base64-encoded) image (i.e. `url(data:image/png;base64,SOME_DATA)`). That is typically the case of webpack url-loader and Django pipeline.

If your map displays hundreds of Markers using this inlined image as icon, be aware that [it will affect the browser performance much more quickly than using a normal URL file](https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-322422045).


## Fix: Firefox high contrast (colours override) option

This plugin also fixes an edge case in Firefox when a user has [configured their browser](https://support.mozilla.org/en-US/kb/change-fonts-and-colors-websites-use#w_other-settings-for-colors) to _always_ override the websites colours.

When [that option](https://support.mozilla.org/en-US/kb/change-fonts-and-colors-websites-use#w_other-settings-for-colors) is set to "Always" in Firefox preferences, all background images are removed. Therefore Leaflet can no longer detect the default icon images path that was clued through CSS `.leaflet-default-icon-path` class `background-image` rule.

In that case, this plugin will try to use the `cursor` rule instead which is not affected by Firefox colours override option. Therefore the plugin CSS duplicates the images path in both `background-image` and `cursor` rules.

However, if you use this plugin to specify your own icon in CSS, make sure to still use `background-image` rule as the first mean to pass your images path, because [Internet Explorer always interpretes URL's in `cursor` rule as absolute](https://stackoverflow.com/questions/12454770/are-cursor-urls-relative-to-the-css-file#answer-12454924).
