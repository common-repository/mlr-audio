<?php
/**
 * Plugin Name: MLR Audio
 * Plugin URI: http://lillistone.me
 * Description: This plugin provides an HTML5 Audio player for your wordpress theme..
 * Version: 0.2
 * Author: Matthew Lillistone
 * Author URI: http://lillistone.me
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU 
 * General Public License as published by the Free Software Foundation; either version 2 of the License, 
 * or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without 
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 *
 * @package   MLRAudio
 * @version   0.2
 * @since     0.2
 * @author    Matthew Lillistone <lillistone.me>
 * @copyright Copyright (c) 2013 - 2016, Matthew Lillistone
 * @link      http://lillistone.me
 * @license   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

/**
 * Sets up the MLAudio plugin.
 *
 * @since  0.1
 */
final class MLR_Audio_Plugin {

        /**
         * Holds the instance of this class.
         *
         * @since  0.1
         * @access private
         * @var    object
         */
        private static $instance;

        /**
         * Stores the directory path for this plugin.
         *
         * @since  0.1
         * @access private
         * @var    string
         */
        private $directory_path;

        /**
         * Stores the directory URI for this plugin.
         *
         * @since  0.1
         * @access private
         * @var    string
         */
        private $directory_uri;

        /**
         * Plugin setup.
         *
         * @since  0.1
         * @access public
         * @return void
         */
        public function __construct() {

				register_activation_hook( __FILE__, array($this, 'mlaudio_install') );
				
                /* Set the properties needed by the plugin. */
                add_action( 'plugins_loaded', array( $this, 'setup' ), 1 );

                /* Internationalize the text strings used. */
                add_action( 'plugins_loaded', array( $this, 'i18n' ), 2 );

                /* Load the functions files. */
                add_action( 'plugins_loaded', array( $this, 'includes' ), 3 );

                /* Load the admin files. */
                add_action( 'plugins_loaded', array( $this, 'admin' ), 4 );

                /* Enqueue scripts and styles. */
                add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ), 15 );
				
				/* Enqueue general admin script. */
				add_action( 'admin_init', array( $this, 'enqueue_admin_scripts' ), 5 );								/* Enqueue general admin script. */				add_action( 'wp_head', array( $this, 'enqueue_custom_style' ), 6 );
        }

		public function mlaudio_install() {
			$this->check_options();	
		}
		
		public function check_options() {
			$default_options = array(
				'playlist_height' 		=> 200,
				'playlist_hidden'		=> '',
				'auto' 					=> '',
				'imageon	' 			=> '',
				'image_pos' 			=> 'default',
				'random_how'			=> 'default',
				'audio_orderby' 		=> 'default',
				'audio_order'			=> 'default',
				'player_color_one' 		=> '#e2e2e2',
				'player_color_two' 		=> '#d2d2d2',
				'player_color_three'	=> '#EBC0C0',
				'player_color_four' 	=> '#EBC0C0',
				'player_color_five' 	=> '#929292',
				'player_color_six'	 	=> '#ddd',
				'player_color_seven'	=> '#000',
				'player_color_eight' 	=> '#EBC0C0',
				'player_color_nine' 	=> '#000',
				'player_color_ten'		=> '#6d6d6d',
				'player_color_eleven'	=> '#9B9B9B'
				);
	
			if(!get_option('mlag')) {
				add_option('mlag', $default_options );
			}
		}
		
        /**
         * Defines the directory path and URI for the plugin.
         *
         * @since  0.1
         * @access public
         * @return void
         */
        public function setup() {
                $this->directory_path = trailingslashit( plugin_dir_path( __FILE__ ) );
                $this->directory_uri  = trailingslashit( plugin_dir_url(  __FILE__ ) );

                /* Legacy */
                define( 'MLR_AUDIO_DIR', $this->directory_path );
                define( 'MLR_AUDIO_URI', $this->directory_uri  );
        }

        /**
         * Loads the initial files needed by the plugin.
         *
         * @since  0.1
         * @access public
         * @return void
         */
        public function includes() {
                require_once( "{$this->directory_path}inc/audio.php" );
        }
				/**         * Loads the custom style files needed by the plugin.         *         * @since  0.1         * @access public         * @return void         */        public function enqueue_custom_style() {								require_once( "{$this->directory_path}inc/audio_custom_style.php"         );        }				
        /**
         * Loads the translation files.
         *
         * @since  0.1
         * @access public
         * @return void
         */
        public function i18n() {

                /* Load the translation of the plugin. */
                load_plugin_textdomain( 'MLR-Audio', false, 'mlr-audio/languages' );
        }

        /**
         * Loads the admin functions and files.
         *
         * @since  0.1
         * @access public
         * @return void
         */
        public function admin() {

                if ( is_admin() )
                        require_once( "{$this->directory_path}inc/options.php" );
        }
		
        /**
         * Enqueues scripts and styles on the front end.
         *
         * @since  0.1
         * @access public
         * @return void
         */
        public function enqueue_scripts() {								wp_enqueue_script( 'jquery-ui-ml-audio', "http://code.jquery.com/ui/1.10.3/jquery-ui.js", array('jquery'), '0.1', false );				wp_enqueue_script( 'jquery-ui-touch-audio', "{$this->directory_uri}js/jquery.ui.touch-punch.min.js", array('jquery','jquery-ui-ml-audio'), '0.1', false );
				wp_enqueue_script( 'jquery-ml-audio', "{$this->directory_uri}js/jquery.ml.audio2.js", array('jquery'), '0.1', true );			if(!preg_match('/(?i)msie [2-8]/',$_SERVER['HTTP_USER_AGENT'])) {					wp_enqueue_style( 'ml-audio-style', "{$this->directory_uri}css/ml_audio.css", false, '0.1', 'all' );				}				else {					wp_enqueue_style( 'ml-ie-audio-style', "{$this->directory_uri}css/ml_ieaudio.css", false, '0.1', 'all' );					}
				}
        
		
		/**
         * Enqueues admin scripts and styles on the front end.
         *
         * @since  0.1
         * @access public
         * @return void
         */
		 
		public function enqueue_admin_scripts() {				
				wp_enqueue_script( 'jquery-general-audio', "{$this->directory_uri}js/jquery.ml.audio.general.js", array('jquery'), '0.1', true );				wp_enqueue_script( 'ml-uploader', "{$this->directory_uri}js/ml.uploader.js", array('jquery'), '0.1', true );				wp_enqueue_style( 'ml-audio-admin-style', "{$this->directory_uri}css/ml_audio_admin.css", false, '0.1', 'all' );
		}
			
        /**
         * Returns the instance.
         *
         * @since  0.1
         * @access public
         * @return object
         */
        public static function get_instance() {

                if ( !self::$instance )
                        self::$instance = new self;

                return self::$instance;
        }
}

MLR_Audio_Plugin::get_instance();

?>