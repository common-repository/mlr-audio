/*
 * @package   MLRAudio
 * @version   0.1
 * @since     0.1
 * @author    Matthew Lillistone <matthewlillistone.co.uk>
 * jQuery to slideToggle playlist depending on whether the scrollbar is set.
 * jQuery extended function to find if parent is the wrapped div.
 */

jQuery(document).ready(function($) {

	$.fn.hasParent = function(p) {
		return this.filter(function() {
			return $(p).find(this).length;
			});
		}
	
	var mlPlayerHidden = $('#ml_container .player').attr('playhide'),
		mlaPlaylistToggle = function($mldependent) {
	
	if($mldependent.css('display') == 'none') { 
			$('#ml_audio_toggle_playlist').attr('title','Show playlist');
			}
			else {
				$('#ml_audio_toggle_playlist').attr('title','Hide playlist');
				}

	$('#ml_audio_toggle_playlist').bind('click',function(e) {
		e.preventDefault();
		$mldependent.slideToggle('slow', function() {
		if($(this).css('display') == 'none') { 
			$('#ml_audio_toggle_playlist').attr('title','Show playlist');
			}
			else {
				$('#ml_audio_toggle_playlist').attr('title','Hide playlist');
				// Get value for slider on display
				var scrollTop = $('.playlist li.active').position().top; 
				var mlScrollTo = 100 - Math.ceil((scrollTop / $('.playlist').innerHeight()) * 100, 10);
				
								$('#slider_vert').slider('value',mlScrollTo);
								
				}
			}
		);
	});
	
	}
	
	if($('.playlist').hasParent('#pl_wrap, #ml_container')) {
	if (typeof(mlPlayerHidden) === "undefined" || mlPlayerHidden == null) {
	} else { 
		if(mlPlayerHidden.length != 0) {
			$('#pl_wrap').css('display','none');
		}
		mlaPlaylistToggle($('#pl_wrap'));
		}
	}
		
	if($('.playlist').hasParent('#ml_container')) {
	if (typeof(mlPlayerHidden) === "undefined" || mlPlayerHidden == null) {
	} else {
		if(mlPlayerHidden.length != 0) {
			$('.playlist').css('display','none');
		}
		mlaPlaylistToggle($('ul.playlist'));
		}
	}				
});
