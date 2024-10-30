==== ML Responsive Audio player with playlist Shortcode ====
Contributors: ersatzpoleDonate link: http://lillistone.me/2014/01/mlr-audio-wp-plugin/Tags: text, php, plugin, shortcode, posts, audio, jqueryRequires at least: 2.8Tested up to: 4.5.3Stable tag: 0.2License: Released under GNU GENERAL PUBLIC LICENSE version 2This plugin displays an HTML5 audio player with playlist in your page/post. 
== Description ==* The plugin generates a shortcode to dynamically display an audio player with playlist.* Displays tracks in the playlist generated from an Audio Element custom post type.  * Upload tracks in different formats for browser compatability.* Customise colors of player.* Audio player will resize in browser window if using responsive theme and fit smaller screen-widths.* See the 'other notes' tab for shortcode instructions.* The plugin is compatible with the latest version of Wordpress and works on touch screen devices.* Multiple Players per page supported.* Shortcode for displaying single track player.* Randomise playlist with no repeated tracks or freely.* There is no flash fallback at the moment so the player will be hidden on browsers which do not support the HTML5 audio tag.
== Installation ==**Install like any other basic plugin:**1. Unzip and copy the mlr-audio folder to your /wp-content/plugins/ folderor upload .zip file from wordpress plugin uploader 
2.Activate the MLR Audio on your plugin-page.
== How to use ==Put this shortcode in your post or pages[ml_audio] The default shortcode will display all posts.*audio_category="Your-category-slug"* 
[ml_audio audio_category="Your-category-slug"] Will display posts from a specific audio category or categories. Separate category slugs by commas.[ml audio auto="1"] Will intialise the player playing the first track on the playlist (Do not use for more than one player per page).
== Changelog ==

0.1 Initial Release0.2 Big upgrade with multiple players per page now supported. Single Player shortcode.
== Screenshots ==1. Audio Element post type screen - note: top right shortcode for individual audio track.2. Player with playlist parameters (Options page).3. Customise Player Colours (Options page).
== Frequently Asked Questions ==
None Yet.
**style it**
At the moment the player will fill the width of the parent div. If you want to give the player a smaller width put the shortcode inside a div with specified width or max-width if you want it to resize.
Example: 
For more info or an example, please visit http://lillistone.me/2014/01/mlr-audio-wp-plugin/