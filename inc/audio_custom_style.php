<style>

/* BODY */

<?php

/* Set Variables */
$ml_audio_params = get_option('mlag');

function set_audio_defaults($param, $default) {
	if($param == '' || $param == 'e2e2e2') {
		return $default;
		}
		else {
			return $param;
			}
}

$playlist_background = set_audio_defaults($ml_audio_params['player_color_one'], '#e2e2e2');

$scrollbar_color = set_audio_defaults($ml_bg_sb = $ml_audio_params['player_color_four'], '#EBC0C0');

$header_background = set_audio_defaults($ml_audio_params['player_color_three'], '#EBC0C0');

$controls_background = set_audio_defaults($ml_audio_params['player_color_two'], '#d2d2d2');

$controls_border = set_audio_defaults($ml_audio_params['player_color_six'], '#ddd');

$buttons_color = set_audio_defaults($ml_audio_params['player_color_five'], '#929292');

$buttons_hover_color = set_audio_defaults($ml_audio_params['player_color_seven'], '#000'); 

$volume_color = set_audio_defaults($ml_audio_params['player_color_eight'], '#EBC0C0');

$header_text_color = set_audio_defaults($ml_audio_params['player_color_nine'], '#000');

$pl_text_color = set_audio_defaults($ml_audio_params['player_color_ten'], '#6d6d6d');

$pl_text_by_color = set_audio_defaults($ml_audio_params['player_color_eleven'], '#9B9B9B');


/* Text */

echo '.playlist {background:' .$playlist_background.';}';

/* Scroll bar */

echo '.ml_audio_random_toggle, .slider-vert .ui-slider-handle, .ml_audio_toggle_playlist {background:' .$scrollbar_color.';}';

/* Controls */

echo '.ml_controls {background:' .$controls_background.';}';
echo '.ml_controls .tracker, .ml_single_contains_audio .ml_controls .tracker {border-top: 1px solid '.$controls_border.'; border-bottom: 1px solid '.$controls_border.';}';
echo 'div.ml_single_contains_audio {border-bottom: 1px solid '.$controls_border.';}';
echo '.tracker .ui-slider-handle {border: 1px solid '.$buttons_color.';}';

/*  Header */

echo '.player, .ml-single-outer-container {background:' .$header_background. ';}';
echo '.player, .fa.fa-times, .fa.fa-check, .fa.fa-question, .fa.fa-bars, .fa.fa-music {color:' .$header_text_color. ';}';


/* Buttons */

echo '.ml_controls i, .tracker .ui-slider-handle {color:' .$buttons_color. ';}';
echo '.volume .ui-slider-handle {background:' .$buttons_color. ';}';
// hover
echo '.ml_controls div:hover i {color:' .$buttons_hover_color. ';}';
echo '.volume:hover .ui-slider-handle {background:' .$buttons_hover_color. ';}';

/* Volume */

echo '.volume .ui-widget-header, .tracker .ui-slider-range.ui-widget-header {background:' .$volume_color. '; opacity:0.5;}';

/* Playlist text */

echo '.playlist li {color:' .$pl_text_color. ';}';
echo '.playlist li span {color:' .$pl_text_by_color. ';}';

if(ml_is_ios()) {
	echo '.ml_controls {height:28px !important;}';
	echo '.ml_controls .rew, .ml_controls .fwd, .ml_controls .play, .ml_controls .pause, .ml_controls .volume {top:0px !important;}';
	echo '.timeleft {top:3px !important;}';
	echo 'div.ml_single_contains_audio {border-top: 1px solid '.$controls_border.';}';
	echo '.ml_contains_audio .ml_controls {border-top: 1px solid '.$controls_border.';}';
	echo 'canvas.mlra-title-canvas {top: 1px !important;}';
}

?>

</style>
