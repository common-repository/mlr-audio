jQuery(document).ready(function($) {
	$('.ml-audio-upload-button').click(function(event) {
		event.preventDefault();
		var $mlAudt = $(this).attr('data-type');
		var mlFrame;
		var mlFrameContainer;
		
		mlFrameContainer = $(this).parent().parent().find('#'+$mlAudt+'_url_meta_box_text');
		
		if ( mlFrame ) {
			mlFrame.open();
			return;
		}
		
		mlFrame = wp.media({
			title: 'Select or Upload Audio',
			button: {
				text: 'Use this audio'
			},
			library: {
				type: 'audio'
			},
			multiple: false  
		});
		
		
		mlFrame.on( 'select', function() {
      
			var attachment = mlFrame.state().get('selection').toJSON();
			var audio = false;
			var n;
				n = attachment[0].url.search('.'+$mlAudt);
				if(n > 0) {
					audio = true;
					mlFrameContainer.val( attachment[0].url );
				}
			
			console.log(attachment);

		});

		mlFrame.open();
		
	});

});