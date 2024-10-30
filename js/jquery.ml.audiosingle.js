/*
 * @package   MLRAudio
 * @version   0.2
 * @since     0.2
 * @author    Matthew Lillistone <lillistone.me>
 * 
 */

jQuery(function($) {
	
	$.fn.getHiddenDimensions = function (includeMargin) {
        var $item = this,
        props = { position: 'relative', visibility: 'hidden', display: 'block' },
        dim = { width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 },
        $hiddenParents = $item.parents().andSelf().not(':visible'),
        includeMargin = (includeMargin == null) ? false : includeMargin;
        var oldProps = [];
        $hiddenParents.each(function () {
            var old = {};

            for (var name in props) {
                old[name] = this.style[name];
                this.style[name] = props[name];
            }

            oldProps.push(old);
        });

        dim.width = $item.width();
        dim.outerWidth = $item.outerWidth(includeMargin);
        dim.innerWidth = $item.innerWidth();
        dim.height = $item.height();
        dim.innerHeight = $item.innerHeight();
        dim.outerHeight = $item.outerHeight(includeMargin);

        $hiddenParents.each(function (i) {
            var old = oldProps[i];
            for (var name in props) {
                this.style[name] = old[name];
            }
        });

        return dim;
    }
	
	function mlAudioSingleFunc(i) {
		var self = this;
		this.supportsAudio = !!document.createElement('audio').canPlayType;
			if(this.supportsAudio) {
				
				this.i = i;
				this.index = 0,
				this.playing = false,
				this.mlseek = false,
				this.mlPlayerWidth = $('#ml_single_container_'+self.i+' .player').attr('playwidth'),
				this.title = $('#ml_single_container_'+self.i+' .audio_title'),
				this.volume = $('#ml_single_container_'+self.i+' .volume'),
				this.tracker = $('#ml_single_container_'+self.i+' .tracker'),
				this.indAuto = $('#ml_single_container_'+self.i+' .single-player').attr('mlauto'),
				this.cw = $('#ml_single_container_'+self.i).getHiddenDimensions().width,
				this.handle = $('#ml_single_container_'+self.i+' .tracker .ui-slider-handle'),
				this.title = $('canvas#mlra_canvas_'+self.i).attr('data-title');
				this.artist = $('canvas#mlra_canvas_'+self.i).attr('data-artist');
				this.album = $('canvas#mlra_canvas_'+self.i).attr('data-album');
				this.color = $('canvas#mlra_canvas_'+self.i).attr('data-color');
				this.defaultVol = 0.35,
				this.mlExtension = '',
				this.tracks = [];
				this.len = $('#ml_single_container_'+self.i+' .playlist li').length;
				this.mlTitle = $('#ml_single_container_'+self.i+' .audio_title');
				this.canvas = document.getElementById('mlra_canvas_'+self.i);
				this.context = this.canvas.getContext('2d');
				this.paused = false;
					
					/* Important playing functions */
					this.audio = new Audio(document.getElementById('audio_'+this.i));

					if (typeof(this.audio) === "undefined" || this.audio == null) {
					} else {
					$(this.audio).bind('play', function() {
						$('#ml_single_container_'+self.i+' .play').addClass('hidden');
						$('#ml_single_container_'+self.i+' .pause').removeClass('hidden');
						self.playing = true;
					}).bind('pause', function() {
						$('#ml_single_container_'+self.i+' .play').removeClass('hidden');
						$('#ml_single_container_'+self.i+' .pause').addClass('hidden');
						self.playing = false;
					}).bind('ended', function() {
							self.audio.pause();
							self.tracker.slider('value',0);
					}).bind('timeupdate',function() {
						var current = parseInt(self.audio.currentTime, 10);
						self.tracker.slider('value',current);
						}).get(0);
			
					
					
					this.loadTrack = function() {
						var file_string = $('#ml_single_container_'+self.i+' .single-player').attr('audiourlmp3');
						var abbr_string = file_string.slice(0, -4);
						this.audio.src = abbr_string + this.mlExtension;
						
					};
					
					this.playTrack = function(id) {
						this.loadTrack();
						this.audio.play();
					};

					this.mlExtension = this.audio.canPlayType('audio/mpeg') ? '.mp3' : this.audio.canPlayType('audio/ogg') ? '.ogg' : this.audio.canPlayType('audio/wav') ? '.wav' : '';

					// Autoplay?
					this.autoPlay = function() {
						if(this.auto != undefined && this.auto.length != 0) {
							this.loadTrack();
							this.audio.play();
						}
						else {
							this.loadTrack();
						}
					}
					
					this.autoPlay();

					this.audio.volume = this.defaultVol;

					this.tracker.width(this.cw);

					if(this.audio.paused) {
						$('#ml_single_container_'+self.i+' .pl').addClass('hidden');
					}

					/* Functionality for player */

					$('#ml_single_container_'+self.i+' .play').bind('click',function() {
						if(!self.playing);
						self.audio.play();
						self.playing = true;
						self.tracker.slider("option", "max", self.audio.duration);
						$(this).addClass('hidden');
						$('#ml_single_container_'+self.i+' .pause').removeClass('hidden');
						});

					$('#ml_single_container_'+self.i+' .pause').bind('click',function() {
						if(self.playing) {
							self.audio.pause();
							self.playing = false;
						}
						else {
							self.audio.play();
						}

						$(this).addClass('hidden');

						$('#ml_single_container_'+self.i+' .play').removeClass('hidden');
					});

					this.startTime = $(self.audio).bind('loadedmetadata',function() {
						var dur = parseInt(self.audio.duration),
							curTime = parseInt(self.audio.currentTime),
							min = Math.floor(dur / 60, 10),
							sec = dur - min * 60,
							curMins = Math.floor(curTime / 60, 10),
							curSecs = Math.floor(curTime % 60);
						
							$('#ml_single_container_'+self.i+' .timeleft').text(curMins + ' : ' + (curSecs > 9 ? curSecs : '0' + curSecs) + '   |   -' + min + ' : ' + (sec > 9 ? sec : '0' + sec));
							self.tracker.slider('option', 'max', self.audio.duration);
						});

					$(self.audio).bind('timeupdate',function() {
						var songDuration = parseInt(self.audio.duration),
							timeRemaining = parseInt(songDuration - self.audio.currentTime, 10),
							curTime = parseInt(self.audio.currentTime),
							now = (self.audio.currentTime / self.audio.duration) * 100,
							mins = Math.floor(timeRemaining / 60, 10),
							curMins = Math.floor(curTime / 60, 10), 
							seconds = Math.floor(timeRemaining - mins * 60, 10);
							curSecs = Math.floor(curTime % 60);
							
							if(!isNaN(mins) || !isNaN(seconds)){
								$('#ml_single_container_'+self.i+' .timeleft').text(curMins + ' : ' + (curSecs > 9 ? curSecs : '0' + curSecs) + '   |   -' + mins + ' : ' + (seconds > 9 ? seconds : '0' + seconds));
							}
							if (!self.mlseek) { self.handle.css({'left': now + '%'}); }
						});

					var plugins_url = this.volume.attr('data-plugins');	
					var opts = this.volume.css('background-image','url(' + plugins_url + '/mlr-audio/css/images/volume_half.png)');
					
					/* Canvas text */
					
					this.setCanvasDims = function() {
						this.canvas.width = this.cw - (140 + 80);
						this.canvas.height = 27;
						this.canvas.style.width = (this.cw - (140 + 80))+'px';
						this.canvas.style.height = '27px';
					}
					this.setCanvasDims();
					
					this.getMessage = function() {
						var message = '';
						if(this.title != '') {
							message += '\''+this.title+'\'';
						} 
						if(this.artist != '') {
							message += ' by '+this.artist;
						}
						if(this.album != '') {
							message += ' from the album \''+this.album+'\'';
						}
						return message;
					}
					
					var mlraCanvasMessage = {
						m: this.getMessage(),
						x: this.canvas.width + 20,
						y: this.canvas.height / 2,
						speed: 0.5,
						height: 27
					};
					
					
					var mlraTextMeasuredLength = this.context.measureText(mlraCanvasMessage.m).width;
	
					window.requestAnimFrame = (function(callback) {
						return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
						function(callback) {
							window.setTimeout(callback, 1000 / 60);
						};
					})();
					
					
					this.drawMessage = function(mlraCanvasMessage) {
						this.context.save();
						this.context.textBaseline = 'middle';
						this.context.fillStyle = (this.color != 'e2e2e2') ? this.color : '#929292';
						this.context.fillText(mlraCanvasMessage.m, mlraCanvasMessage.x, mlraCanvasMessage.y);
						this.context.restore();	
					}
					
					this.animate = function(mlraCanvasMessage) {
						var linearSpeed = mlraCanvasMessage.speed;
						if(!this.paused) {
							if(mlraCanvasMessage.x > (0 - (mlraTextMeasuredLength + 20))) {
								mlraCanvasMessage.x -= linearSpeed;
							}
							else {
								mlraCanvasMessage.x = this.canvas.width + 20;
								mlraCanvasMessage.x -= linearSpeed;
							}
		
							/* clear */
							this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
							this.drawMessage(mlraCanvasMessage);
			
							/* request a new frame */
							requestAnimFrame(function() {
								self.animate(mlraCanvasMessage);
							});
						}
					}
					
					this.animate(mlraCanvasMessage);
					var mlraResizeTimer;
					
					$(window).on('resize', function() {
						self.paused = true;
						self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
						clearTimeout(mlraResizeTimer);
							mlraResizeTimer = setTimeout(function() {
								self.cw = $('#ml_single_container_'+self.i).getHiddenDimensions().width;
								$('#ml_single_container_'+self.i+' .tracker').width(self.cw);
								self.setCanvasDims();
								var mlraCanvasMessage = {
									m: self.getMessage(),
									x: self.canvas.width + 20,
									y: self.canvas.height / 2,
									speed: 0.5,
									height: 27
								};
								self.paused = false;
								self.animate(mlraCanvasMessage);
							}, 250);
					});
					
					/* Volume slider */

					self.volume.slider({
						range: 'min',
						min: 0,
						max: 100,
						value: 35,
						animate: true,
						slide: function(e,ui) {
							self.audio.volume = ui.value / 100;
							self.defaultVol = ui.value / 100;
							},
						change: function(e,ui) {
						var currentValue = ui.value;
							if(ui.value == 0) {
								$(this).css('background-image','url(' + plugins_url + '/mlr-audio/css/images/volume_grey.png)');
								}
								else if(ui.value >= 68) {
									$(this).css('background-image','url(' + plugins_url + '/mlr-audio/css/images/volume.png)');
									}
									else if(ui.value < 68 && ui.value > 32) {
										$(this).css('background-image','url(' + plugins_url + '/mlr-audio/css/images/volume_half.png)');
										}
										else if(ui.value <= 32 && ui.value > 0) {
											$(this).css('background-image','url(' + plugins_url + '/mlr-audio/css/images/volume_down.png)');
											}
						}
					});

					/* On volume mouseover show volume value as title */
					$('#ml_single_container_'+self.i+' .volume .ui-slider-handle').on('mouseover',function() {
							$(this).parent().attr('title','vol = ' + self.volume.slider('value') + '%');
					});

					/* Change image in volume div depending on handle value */
					$('#ml_single_container_'+self.i+' .volume .ui-slider-handle').bind('mousedown', function(e){
							$('#ml_single_container_'+self.i+' .volume .ui-slider-handle').bind('mousemove', function(e){
								dragged = e.pageX,
								movement = dragged;
								movement = self.volume.slider('value');
								if(movement == 0) {
								$(this).parent().css('background-image','url(' + plugins_url + '/mlr-audio/css/images/volume_grey.png)');
								}
								else if(movement >= 68) {
									$(this).parent().css('background-image','url(' + plugins_url + '/mlr-audio/css/images/volume.png)');
									}
									else if(movement < 68 && movement > 32) {
										$(this).parent().css('background-image','url(' + plugins_url + '/mlr-audio/css/images/volume_half.png)');
										}
										else if(movement <= 32 && movement > 0) {
											$(this).parent().css('background-image','url(' + plugins_url + '/mlr-audio/css/images/volume_down.png)');
											}	
							});

							$('#ml_single_container_'+self.i+' .volume .ui-slider-handle').bind('mouseup.mlDown',function(e){
								$('#ml_single_container_'+self.i+' .volume .ui-slider-handle').removeClass('dragged');
								$(this).unbind('mousemove');
							});
						});

					/* Tracker slider */

					self.tracker.slider({
						range: 'min',
						min: 0,
						max: self.audio.duration,
						animate: true,
						slide: function(e,ui) {
							self.audio.currentTime = ui.value;
							},
						});
					
					/* Playlist toggle */
					
					$.fn.hasParent = function(p) {
						return this.filter(function() {
							return $(p).find(this).length;
						});
					}			

					}
			} /* End if supports audio */
			
	}
	
	function mlAudioSingleAutoPlay(obj) {
		this.obj = obj;
		if((this.obj.auto != undefined && this.obj.auto.length != 0 && mlContainsAllElements.length < 2) || (this.obj.indAuto != undefined && this.obj.indAuto.length != 0 && this.obj.indAuto != 0)) {
			this.obj.loadTrack(this.obj.index);
			this.obj.audio.play();
		}
		else {
			this.obj.loadTrack(this.obj.index);
		}
	}
	
	function mlAudioSinglePauseAllTracks(obj) {
		this.obj = obj;
		if(this.obj.playing) {
			this.obj.audio.pause();
			this.obj.playing = false;
		}
	}
	
	var mlSingleContainsElements = $('.ml_single_contains_audio');
	var mlSingleContainsAllElements = [];
	if(mlSingleContainsElements.length) {
		for(var k = 0; k < mlSingleContainsElements.length; k++) {
			mlSingleContainsAllElements[k] = new mlAudioSingleFunc(k+1);
		}
		for(var l = 0; l < mlSingleContainsElements.length; l++) {
			mlAudioSingleAutoPlay(mlSingleContainsAllElements[l]);
		}
	}
	
	$('.ml_single_contains_audio .play').bind('click',function() {
		for(var i = 0; i < mlSingleContainsAllElements.length; i++) {
			mlAudioSinglePauseAllTracks(mlSingleContainsAllElements[i]);
		}
		var instance = $(this).parent().parent().parent('.ml_single_contains_audio').attr('ml_instance');
		var currentObj = mlSingleContainsAllElements[parseInt(instance) - 1];		
			currentObj.playing = true;
			currentObj.tracker.slider("option", "max", currentObj.audio.duration);
			$(this).addClass('hidden');
			$('#ml_single_container_'+currentObj.i+' .pause').removeClass('hidden');
			currentObj.audio.play();
	});
	
});