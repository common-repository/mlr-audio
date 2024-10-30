(function($) {
    "use strict";
	
    function setColorPicker($instance) {
	
	if($instance.closest('table').attr('id') == '') {
		$instance.closest('table').attr('id','ml_colors');
		}
		
	$instance.closest('tr').css({'vertical-align':'top'});
	$instance.closest('tr').children().eq(0).css({'vertical-align':'top'});
	
	function pickColor(color) {
        $instance.val(color);
    }
	function toggle_text() {
        link_color = $instance;
        if ("" === link_color.val().replace("#", "")) {
            link_color.val(default_color);
            pickColor(default_color);
        } else pickColor(link_color.val());
    }
    
    var default_color = "e2e2e2";
   	
        var link_color = $instance;
        link_color.wpColorPicker({
            change: function(event, ui) {
                pickColor(link_color.wpColorPicker("color"));
            },
            clear: function() {
                pickColor("");
            }
        });		
	
	$(this).click(toggle_text);
        toggle_text();
	
	}
		
    setColorPicker($('#player_color_one'));
	setColorPicker($('#player_color_two'));
	setColorPicker($('#player_color_three'));
	setColorPicker($('#player_color_four'));
	setColorPicker($('#player_color_five'));
	setColorPicker($('#player_color_six'));
	setColorPicker($('#player_color_seven'));
	setColorPicker($('#player_color_eight'));
	setColorPicker($('#player_color_nine'));
	setColorPicker($('#player_color_ten'));
	setColorPicker($('#player_color_eleven'));
	
})(jQuery);