<?php

/*
 * @package   MLRAudio
 * @version   0.2
 * @since     0.1
 * @author    Matthew Lillistone <lillistone.me>
 * 
 */


add_action( 'wp_enqueue_scripts', 'prefix_enqueue_awesome' );

if ( !function_exists( 'prefix_enqueue_awesome' ) ) {

function prefix_enqueue_awesome() {
	$plugins_url = plugins_url();
	wp_enqueue_style( 'prefix-new-font-awesome', $plugins_url . '/mlr-audio/font-awesome-4.0.3/css/font-awesome.min.css', array(), '4.0.3' );
}

}

add_action('init','create_audio_post_type');

function create_audio_post_type() {
	register_post_type( 'ml_audio',
		array(
		'menu_icon' => 'dashicons-playlist-audio',
		'labels' => array(
				'name' => __( 'Audio Elements','ML' ),
				'singular_name' => __( 'Audio Element','ML' ),
				'add_new' => 'Add New',
                'add_new_item' => 'Add New Audio Element',
                'edit' => 'Edit',
                'edit_item' => 'Edit Audio Element',
                'new_item' => 'New Audio Element',
                'view' => 'View',
                'view_item' => 'View Audio Element',
                'search_items' => 'Search Audio Elements',
                'not_found' => 'No Audio Elements found',
                'not_found_in_trash' => 'No Audio Elements found in Trash',
                'parent' => 'Parent Audio Element'
			),

		'public' => true,
		'exclude_from_search' => true,
		'publicly_queryable' => false,
		'has_archive' => false,
		'show_ui' => true,
		'taxonomies' => array('audio_category'),
        'capability_type' => 'post',  
        'hierarchical' => false,  
        'rewrite' => true,
		'map_meta_cap' => true,
		'query_var' => true,
		'register_meta_box_cb' => 'audio_meta_box_add',
        'supports' => array('title', 'thumbnail', 'Audio parameters' )
		)

	);
}
	
add_action( 'init', 'create_audio_taxonomies', 10, 2 );

if ( !function_exists( 'create_audio_taxonomies' ) ) {
function create_audio_taxonomies() {
    register_taxonomy(
        'audio_category',
	array( 'ml_audio' ),
        array(
            'labels' => array(
                'name' => __('Audio Category','ML'),
                'add_new_item' => 'Add New Audio Category',
                'new_item_name' => 'New Audio Category Name'
            ),
			'public' => true,
			'exclude_from_search' => true,
            'show_ui' => true,
			'show_admin_column' => true,
			'publicly_queryable' => false,
            'show_tagcloud' => false,
            'hierarchical' => true,
			'query_var' => true
        )
    );

	}

}

	function add_extra_image_size() {
		add_image_size( 'audio-thumb', 95, 95, true );
		}
		
	add_action('init','add_extra_image_size');	

/*************************************************
=================== SHORTCODES ===================
*************************************************/

function mlra_shortcode($atts, $content=null){
	static $instance = 0;
		$instance++;
		
		$single = $atts['id'];
		$args = array(
			'post_type'		=> 'ml_audio',
			'meta_key'      => '_mlaudio_shortcode_output',
			'meta_value'    => $single,
		);
		
		$single_audio = get_posts( $args );
		$single_id = $single_audio[0]->ID;
		
		extract( shortcode_atts( array (
			'id' 	  => '',
			'auto'	  => 0
		), $atts ) );
		
		$ml_audio_params = get_option('mlag');
		$mla_title = get_the_title( $single_id );
		$mla_art = get_post_meta( $single_id, 'artist_meta_box_text', true);
		$mla_alb = get_post_meta( $single_id, 'album_meta_box_text', true);
		$mla_mp3 = get_post_meta( $single_id, 'mp3_url_meta_box_text', true);
		$mla_ogg = get_post_meta( $single_id, 'ogg_url_meta_box_text', true);
		$mla_wav = get_post_meta( $single_id, 'wav_url_meta_box_text', true);
		$mla_stc = $ml_audio_params['player_color_five'];
		$mlsa_plugins = plugins_url();
		
		$mlsingle = '<div id="ml_single_outer_container_'.$instance.'" class="ml-single-outer-container">';
		$mlsingle .= '<div id="ml_single_container_'.$instance.'" class="ml_single_contains_audio" ml_instance="' .$instance. '">';
	
		$mlsingle .= '<div class="single-player" mlauto="' .$auto. '" audiourlmp3="' .esc_url($mla_mp3). '" audiourlogg="' .esc_url($mla_ogg). '" audiourlwav="' .esc_url($mla_wav). '" artist="' .$mla_art. '" album ="' .$mla_alb. '" title="' .$mla_title. '">
				<div class="ml_controls">';
				if(ml_is_ios() === false) {
					$mlsingle .= '<div class="tracker"></div>';
				}
		$mlsingle .=	'<div id="audio_single_'.$instance.'" class="audio-single">
					<audio id="audio_single_'.$instance.'"></audio>
				</div>
			
				<div class="play"><i class="fa fa-play-circle"></i></div>
				<div class="pause hidden"><i class="fa fa-pause"></i></div>
				<div id="loading"></div><div class="timeleft"></div>
				<canvas data-color="'.$mla_stc.'" data-title="'.$mla_title.'" data-artist="'.$mla_art.'" data-album="'.$mla_alb.'" id="mlra_canvas_'.$instance.'" class="mlra-title-canvas"></canvas>
				<div class="volume" data-plugins="' .$mlsa_plugins. '"></div>
			
			</div>';
		$mlsingle .= '</div></div></div>';
	
	return $mlsingle;
}

add_shortcode('mlra', 'mlra_shortcode');

function ml_insert_audio($atts, $content=null){

	global $post;
	
	static $ml_audio_instance;
	$ml_audio_instance++;
	/*if($ml_audio_instance > 1) {
		return;
		}
	*/
	$ml_audio_params = get_option('mlag');
	$ml_player_width = isset($ml_audio_params['audio_width']) ? $ml_audio_params['audio_width'] : '';
	$ml_playlist_hidden = isset($ml_audio_params['playlist_hidden']) ? $ml_audio_params['playlist_hidden'] : '';
	$ml_playlist_height = isset($ml_audio_params['playlist_height']) ? $ml_audio_params['playlist_height'] : '';
	$ml_autoplay = isset($ml_audio_params['auto']) ? $ml_audio_params['auto'] : '';
	$ml_imageon = isset($ml_audio_params['imageon']) ? $ml_audio_params['imageon'] : '';
	$ml_image_pos = isset($ml_audio_params['image_pos']) ? $ml_audio_params['image_pos'] : '';
	$ml_random_how = isset($ml_audio_params['random_how']) ? $ml_audio_params['random_how'] : '';
	if($ml_audio_params['audio_orderby'] != '') {
		$ml_orderby = $ml_audio_params['audio_orderby'];
		}
		else if($ml_audio_params['audio_orderby'] == 'default') {
			$ml_orderby = 'date';
			}
	if($ml_audio_params['audio_order'] != '') {
		$ml_order = $ml_audio_params['audio_order'];
		}
		else if($ml_audio_params['audio_order'] == 'default') {
			$ml_order = 'DESC';
			}
	
	$mla_plugins = plugins_url();
	extract(shortcode_atts( array (
	
        'post_type'		 => 'ml_audio',
		'posts_per_page' => '-1',
        'order' 		 => $ml_order ? $ml_order : '',
        'orderby' 		 => $ml_orderby ? $ml_orderby : '',
		'include' 		 => '',
		'auto'	  		 => 0,
        'audio_category' => '' 

    ), $atts ) );	
	
	$ml_query_opts = array(
		'post_type'		 => 'ml_audio',
		'posts_per_page' => '-1',
        'order' 		 => $ml_order ? $ml_order : '',
        'orderby' 		 => $ml_orderby ? $ml_orderby : '',
		'include' 		 => '',
        'taxonomy' 		 => 'audio_category',
		'term'			 => $audio_category
	);

	$mlaudio = '<div id="ml_container_'.$ml_audio_instance.'" class="ml_contains_audio" ml_instance="' .$ml_audio_instance. '">';
	
		$mlaudio.=	'<div mlrandomhow="'.$ml_random_how.'" mlautoplay="' .$ml_autoplay. '" playheight="' .$ml_playlist_height. '" playhide="' .$ml_playlist_hidden. '"  mlauto="' .$auto. '" class="player">
			<div class="pl"><i class="fa fa-music"></i></div>
			
			<div class="artist"></div>
			<div imageon="' .$ml_imageon. '" imagepos="' .$ml_image_pos. '" class="cover"></div>
			
				<div class="audio_title"></div><br />
				<div class="album_title"></div>
				
				<!---<a class="button" id="close" href="#" title=""><i class="fa fa-power-off"></i></a>--->
			
			</div>
			<div class="ml_controls">';
			if(ml_is_ios() === false) {
				$mlaudio .= '<div class="tracker"></div>';
			}
		$mlaudio .=	'<div id="audio0_'.$ml_audio_instance.'" class="audio0">
            <audio id="audio_'.$ml_audio_instance.'">
			Your browser does not support the HTML5 Audio Tag
			</audio>
			</div>
			
			<div class="rew"><i class="fa fa-step-backward"></i></div>
			<div class="play"><i class="fa fa-play-circle"></i></div>
			<div class="pause hidden"><i class="fa fa-pause"></i>
			</div><div id="loading"></div><div class="timeleft"></div>
			<div class="volume" data-plugins="' .$mla_plugins. '"></div>
			<div class="fwd"><i class="fa fa-step-forward"></i></div>
			
			</div>';
		
		$mlaudio.= '<ul class="playlist">';
		
		$query = new WP_Query( $ml_query_opts );
		
		if ($query->have_posts()) : while ($query->have_posts()) : $query->the_post();
		
		$mla_title = get_the_title( $post->ID );

		$mla_img_get = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID , 'thumbnail') );
		$mla_img_get_medium = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID, 'medium') );
		$mla_img = $mla_img_get[0];
		$mla_img_medium = $mla_img_get_medium[0];
		$mla_image_height = $mla_img_get[2];
		$mla_image_height_medium = $mla_img_get_medium[2];
		
		$mla_get_category = get_the_category_list(', ', $post->ID);
		
		$mla_art = get_post_meta( $post->ID, 'artist_meta_box_text', true);
		$mla_alb = get_post_meta( $post->ID, 'album_meta_box_text', true);
		$mla_mp3 = get_post_meta( $post->ID, 'mp3_url_meta_box_text', true);
		$mla_ogg = get_post_meta( $post->ID, 'ogg_url_meta_box_text', true);
		$mla_wav = get_post_meta( $post->ID, 'wav_url_meta_box_text', true);
		

		$mla_cap= get_the_content();
		
		$mlaudio.='<li class="audio-node" audiourlmp3="' .$mla_mp3. '" audiourlogg="' .$mla_ogg. '" audiourlwav="' .$mla_wav. '" artist="' .$mla_art. '" album ="' .$mla_alb. '" cover="' .$mla_img. '" data-height="' .$mla_image_height. '" title="' .$mla_title. '">'; 
		$mlaudio.= $mla_title;
		if($mla_art != '') {
		$mlaudio.='<span class="timex"> by ' .$mla_art. '</span>';
		}
		$mlaudio.='</li>';

	endwhile; endif; wp_reset_query();

	$mlaudio.= '</ul><a href="#" class="ml_audio_random_toggle"><i class="fa fa-music"></i><i class="fa fa-question"></i><i class="fa fa-times"></i></a>
		<a href="#" class="ml_audio_toggle_playlist"><i class="fa fa-bars"></i></a>
		</div>';

return $mlaudio;

}

add_shortcode('ml_audio', 'ml_insert_audio');



add_action( 'add_meta_boxes', 'audio_meta_box_add' );

function audio_meta_box_add() {
	add_meta_box( 'track-meta-box-id', 'Audio parameters', 'audio_meta_box_cb', 'ml_audio', 'normal', 'high' );
	add_meta_box( 'unique-meta-box-id', 'Single Audio Shortcode', 'mlaudio_shortcode_custom', 'ml_audio', 'side', 'high' );
}

function mlaudio_shortcode_custom( $post ) {
	wp_nonce_field( 'audio_meta_box_nonce', 'meta_box_nonce' );
?>
<div id="mlaudio_shortcode_display">
<?php
	$unique = uniqid('single_');
	get_post_meta( $post->ID, '_mlaudio_shortcode_output', true ) == '' ? add_post_meta($post->ID, '_mlaudio_shortcode_output', $unique, true) : '';
	$shortcode = '[mlra id=\''.get_post_meta( $post->ID, '_mlaudio_shortcode_output', true ).'\']';
	echo '<input readonly type="text" class="widefat" name="mlaudio_shortcode_output" id="mlaudio_shortcode_output" value="'.$shortcode.'" />';
?>
</div>
<?php
}

if(!function_exists('audio_meta_box_cb')) {
function audio_meta_box_cb( $post )

{
	$values = get_post_custom( $post->ID );
	$artist_content = isset( $values['artist_meta_box_text'] ) ? esc_attr( $values['artist_meta_box_text'][0] ) : '';
	$album_content = isset( $values['album_meta_box_text'] ) ? esc_attr( $values['album_meta_box_text'][0] ) : '';
	$mp3_url_content = isset( $values['mp3_url_meta_box_text'] ) ? esc_attr( $values['mp3_url_meta_box_text'][0] ) : '';
	$ogg_url_content = isset( $values['ogg_url_meta_box_text'] ) ? esc_attr( $values['ogg_url_meta_box_text'][0] ) : '';
	$wav_url_content = isset( $values['wav_url_meta_box_text'] ) ? esc_attr( $values['wav_url_meta_box_text'][0] ) : '';
	
	wp_nonce_field( 'audio_meta_box_nonce', 'meta_box_nonce' );

	?>

	

	<table>
	
	<tr>
		<td><label for="artist_meta_box_text" style="font-size:1em;"><?php _e('Artist Name','ML'); ?> </label></td>

		<td><input type="text" style="width:200px;" name="artist_meta_box_text" id="artist_meta_box_text" value="<?php echo $artist_content ?>" /></td>
	</tr>
	
	<tr>

		<td><label for="album_meta_box_text" style="font-size:1em;"><?php _e('Album Name','ML'); ?> </label></td>

		<td><input type="text" style="width:200px;"  name="album_meta_box_text" id="album_meta_box_text" value="<?php echo $album_content ?>" /></td>
	</tr>
	
	</table>

	<table id="audio_files">
	<tr>
		<td><label for="mp3_url_meta_box_text"><?php _e('.mp3 file','ML'); ?> </label></td>

		<td><input type="text" style="width:350px;" name="mp3_url_meta_box_text" id="mp3_url_meta_box_text" value="<?php echo $mp3_url_content ?>" /></td>

		<td><input type="submit" class="button ml-audio-upload-button" data-type="mp3" name="mp3_upload_button" id="mp3_upload_button" value="Upload" /></td>
	</tr>
	
	<tr>

		<td><label for="ogg_url_meta_box_text"><?php _e('.ogg file','ML'); ?> </label></td>

		<td><input type="text" style="width:350px;" name="ogg_url_meta_box_text" id="ogg_url_meta_box_text" value="<?php echo $ogg_url_content ?>" /></td>

		<td><input type="submit" class="button ml-audio-upload-button" data-type="ogg" name="ogg_upload_button" id="ogg_upload_button" value="Upload" /></td>
	</tr>
	
	<tr>

		<td><label for="wav_url_meta_box_text"><?php _e('.wav file','ML'); ?> </label></td>

		<td><input type="text" style="width:350px;" name="wav_url_meta_box_text" id="wav_url_meta_box_text" value="<?php echo $wav_url_content ?>" /></td>

		<td><input type="submit" class="button ml-audio-upload-button" data-type="wav" name="wav_upload_button" id="wav_upload_button" value="Upload" /></td>

	</tr>
</table>
	

	<?php	

}
} // End audio_meta_box_cb



add_action( 'save_post', 'audio_meta_box_save', 10, 2 );

if(!function_exists('audio_meta_box_save')) {
function audio_meta_box_save( $post_id )
{
	// Bail if we're doing an auto save
	if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;

	// if our nonce isn't there, or we can't verify it, bail
	if( !isset( $_POST['meta_box_nonce'] ) || !wp_verify_nonce( $_POST['meta_box_nonce'], 'audio_meta_box_nonce' ) ) return;

	// if our current user can't edit this post, bail
	if( !current_user_can( 'edit_post', $post_id ) ) return;

	// now we can actually save the data
	$allowed = array( 
		'a' => array( // on allow a tags
			'href' => array() // and those anchors can only have href attribute
		)
	);

	// Content saving
	
	if( isset( $_POST['artist_meta_box_text'] ) ) {
		update_post_meta( $post_id, 'artist_meta_box_text', wp_kses( $_POST['artist_meta_box_text'], $allowed ) );		 
}
	else {
	delete_post_meta( $post_id, 'artist_meta_box_text' );
	}
	
	if( isset( $_POST['album_meta_box_text'] ) ) {
		update_post_meta( $post_id, 'album_meta_box_text', wp_kses( $_POST['album_meta_box_text'], $allowed ) );		 
}
	else {
	delete_post_meta( $post_id, 'album_meta_box_text' );
	}
	
	// mp3 saving
	
	if( isset( $_POST['mp3_url_meta_box_text'] ) && preg_match('/(\.mp3)$/', $_POST['mp3_url_meta_box_text']) ) {
		update_post_meta( $post_id, 'mp3_url_meta_box_text', wp_kses( $_POST['mp3_url_meta_box_text'], $allowed ) );
}
	else {
	delete_post_meta( $post_id, 'mp3_url_meta_box_text' );
	}
	
	// ogg saving
	
	if( isset( $_POST['ogg_url_meta_box_text'] ) && preg_match('/(\.ogg)$/', $_POST['ogg_url_meta_box_text']) ) {
		update_post_meta( $post_id, 'ogg_url_meta_box_text', wp_kses( $_POST['ogg_url_meta_box_text'], $allowed ) );
}
	else {
	delete_post_meta( $post_id, 'ogg_url_meta_box_text' );
	}
	
	// wav saving
	
	if( isset( $_POST['wav_url_meta_box_text'] ) && preg_match('/(\.wav)$/', $_POST['wav_url_meta_box_text']) ) {
		update_post_meta( $post_id, 'wav_url_meta_box_text', wp_kses( $_POST['wav_url_meta_box_text'], $allowed ) );
}
	else {
	delete_post_meta( $post_id, 'wav_url_meta_box_text' );
	}

}
}


// Audio Element column list 

add_filter('manage_edit-ml_audio_columns','callback_register_audio_columns');

function callback_register_audio_columns($columns) {
	$columns = array(
		'cb' => '<input type="checkbox" />',
		'mlr_img' => '',
		'title' => 'Title',
		'artist' => 'Artist',
		'album' => 'Album',
		'formats' => 'Formats',
		'audio_category' => 'Category',
		'date' => 'Date Added'
		);
	return $columns;
}

function _add_image_audio_start_list_items($column) {
	global $post;
	if($column == 'mlr_img') {
	$thumb = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'thumbnail' );
	$url = $thumb['0'];
	
	if($url) {
		echo '<img src="' .esc_url($url). '" alt="" width="40px" height="40px" />';
		}
		else {echo $url;}
	}	
	
}

add_action('manage_posts_custom_column','_add_image_audio_start_list_items', 10, 2);
			

add_action('manage_posts_custom_column','callback_handle_audio_columns');

function callback_handle_audio_columns($column) {
	global $post;
	if($post->post_type != 'ml_audio') {
		return;
		}
		if($column == 'artist') {
			echo get_post_meta($post->ID, 'artist_meta_box_text', true);
			}
		if($column == 'album') {
			echo get_post_meta($post->ID, 'album_meta_box_text', true);
			}
		if($column == 'formats') {
			if(get_post_meta($post->ID, 'mp3_url_meta_box_text', true) != '') {
				echo "mp3<br />";
				}
			if(get_post_meta($post->ID, 'ogg_url_meta_box_text', true) != '') {
				echo "ogg<br />";
				}
			if(get_post_meta($post->ID, 'wav_url_meta_box_text', true) != '') {
				echo "wav<br />";
				}
		}
		if($column == 'audio_category') {
			echo get_the_term_list( $post->ID, 'audio_category', '', ', ' );
			}
}

add_filter('manage_edit-ml_audio_sortable_columns','ml_audio_sortable_cols');

function ml_audio_sortable_cols($columns) {
	$columns['album'] = 'album';
	$columns['artist'] = 'artist';
	return $columns;
}

add_action( 'pre_get_posts', 'ml_audio_column_orderby' ); 
 
function ml_audio_column_orderby( $query ) {  
    if( ! is_admin() )  
        return;  

    $orderby = $query->get('orderby');  

	if( 'album' == $orderby ) {
		$query->set('meta_key','album_meta_box_text');
		$query->set('orderby','meta_value');
		}
	if( 'artist' == $orderby ) {
		$query->set('meta_key','artist_meta_box_text');
		$query->set('orderby','meta_value');
		}		
} 
 
function ml_is_ios() {
	$iPod    = stripos($_SERVER['HTTP_USER_AGENT'],"iPod");
	$iPhone  = stripos($_SERVER['HTTP_USER_AGENT'],"iPhone");
	$iPad    = stripos($_SERVER['HTTP_USER_AGENT'],"iPad");
	$Android = stripos($_SERVER['HTTP_USER_AGENT'],"Android");
	$webOS   = stripos($_SERVER['HTTP_USER_AGENT'],"webOS");
	if( $iPod || $iPhone ){
		return true;
	}else if($iPad){
		return true;
	}else if($Android){
		return true;
	}else if($webOS){
		return false;
	}
	else {
		return false;
	}
} 
 
?>