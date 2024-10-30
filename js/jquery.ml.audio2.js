/*
 * @package   MLRAudio
 * @version   0.2
 * @since     0.2
 * @author    Matthew Lillistone <lillistone.me>
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
	
/******************************************
================= PLAYLIST ================
*******************************************/
	
	function mlAudioFunc(i) {
		var self = this;
		this.supportsAudio = !!document.createElement('audio').canPlayType;
			if(this.supportsAudio) {
				
				this.i = i;
				this.index = 0,
				this.playing = false,
				this.mlseek = false,
				this.mlPlayerWidth = $('#ml_container_'+self.i+' .player').attr('playwidth'),
				this.auto = $('#ml_container_'+self.i+' .player').attr('mlautoplay'),
				this.indAuto = $('#ml_container_'+self.i+' .player').attr('mlauto'),
				this.mlPlaylistHeight = $('#ml_container_'+self.i+' .player').attr('playheight'),
				this.mlImageon = $('#ml_container_'+self.i+' .cover').attr('imageon'),
				this.mlImagepos = $('#ml_container_'+self.i+' .cover').attr('imagepos'),
				this.mlShuffle = $('#ml_container_'+self.i+' .player').attr('mlshuffle'),
				this.title = $('#ml_container_'+self.i+' .audio_title'),
				this.volume = $('#ml_container_'+self.i+' .volume'),
				this.tracker = $('#ml_container_'+self.i+' .tracker'),
				this.cw = $('#ml_container_'+self.i).getHiddenDimensions().width,
				this.handle = $('#ml_container_'+self.i+' .tracker .ui-slider-handle'),
				this.randomHow = $('#ml_container_'+self.i+' .player').attr('mlrandomhow');
				this.defaultVol = 0.35,
				this.mlExtension = '',
				this.tracks = [];
				this.randomNoRepeat = [];
				this.len = $('#ml_container_'+self.i+' .playlist li').length;
					for(var i = 0; i < this.len; i++) {
							this.mlobj = {name: $('#ml_container_'+self.i+' .playlist li:eq('+i+')').attr('title'),
									   album: $('#ml_container_'+self.i+' .playlist li:eq('+i+')').attr('album'),
									   cover: $('#ml_container_'+self.i+' .playlist li:eq('+i+')').attr('cover'),
									   height: $('#ml_container_'+self.i+' .playlist li:eq('+i+')').attr('data-height'),
									   artist: $('#ml_container_'+self.i+' .playlist li:eq('+i+')').attr('artist'),
									   file: $('#ml_container_'+self.i+' .playlist li:eq('+i+')').attr('audiourlmp3'),
									   ogg: $('#ml_container_'+self.i+' .playlist li:eq('+i+')').attr('audiourlogg'),
									   wav: $('#ml_container_'+self.i+' .playlist li:eq('+i+')').attr('audiourlwav')
									   }
					this.tracks.push(this.mlobj);
					this.randomNoRepeat.push(i);
					}

					this.trackCount = this.tracks.length,
					this.countDown = this.tracks.length,
					this.mlTitle = $('#ml_container_'+self.i+' .audio_title');
					
					
					/* Random toggle */
					this.randomChecked = false;
						
					$('#ml_container_'+self.i+' .ml_audio_random_toggle').bind('click',function(e) {
						e.preventDefault();
						if(self.randomChecked == false) {
							$(this).children().eq(2).removeClass('fa-times').addClass('fa-check');
							$(this).attr('title','Random Toggle On');
							self.randomChecked = true;
						}
						else {
							$(this).children().eq(2).removeClass('fa-check').addClass('fa-times');
							$(this).attr('title','Random Toggle Off');
							self.randomChecked = false;
							self.resetNoRepeats();
						}
					}).bind('hover',function() {
						self.randomChecked == false ? $(this).attr('title','Random Toggle Off') : $(this).attr('title','Random Toggle On');
					});
					
					/* Important playing functions */
					this.audio = new Audio(document.getElementById('audio_'+this.i));
					
					this.getRandomIndex = function(current) {
						var picked = Math.floor(Math.random() * (this.trackCount - 1));
						var signR = Math.round(Math.random());
						var sign = (signR == 0) ? -1 : 1;
							if(current == picked && current == 0) {
								return (picked + 1);
							}
							else if(current == picked && current == (this.trackCount - 1)) {
								return (picked - 1);
							}
							else if(current == picked && current != 0 && current != (this.trackCount - 1)) {
								return (picked + sign);
							}
							else {
								return picked;
							}
					}
					
					this.returnNoRepeats = function(current) {
						if(this.randomNoRepeat.length > 1) {
							var indexOfCurrent = this.randomNoRepeat.indexOf(current);
							this.randomNoRepeat.splice(indexOfCurrent, 1);
							this.countDown -= 1;
							
							var index = Math.floor(Math.random() * (this.countDown - 1));
							
						return this.randomNoRepeat[index];
						}
						else {
							this.countDown = this.tracks.length;
							for(var i = 0; i < this.len; i++) {
								this.randomNoRepeat.push(i);
							}
							var indexOfCurrent = this.randomNoRepeat.indexOf(current);
							this.randomNoRepeat.splice(indexOfCurrent, 1);
							
							var index = Math.floor(Math.random() * (this.countDown - 1));
								
						return this.randomNoRepeat[index];
						}
					}
					
					this.resetNoRepeats = function() {
						self.countDown = self.tracks.length;
						self.randomNoRepeat = [];
						for(var i = 0; i < self.len; i++) {
							self.randomNoRepeat.push(i);
						}
					}

					if (typeof(this.audio) === "undefined" || this.audio == null || typeof(this.mlobj) === "undefined" || this.mlobj == null) {
					} else {
					$(this.audio).bind('play', function() {
						$('#ml_container_'+self.i+' .play').addClass('hidden');
						$('#ml_container_'+self.i+' .pause').removeClass('hidden');
						self.playing = true;
					}).bind('pause', function() {
						$('#ml_container_'+self.i+' .play').removeClass('hidden');
						$('#ml_container_'+self.i+' .pause').addClass('hidden');
						self.playing = false;
					}).bind('ended', function() {
						if(self.randomChecked) {
							var i = (self.randomHow != 'no_repeats') ? self.getRandomIndex(self.index) : self.returnNoRepeats(self.index);
							self.index = i;
						}
						
						if(!self.randomChecked && (self.index + 1) < self.trackCount) {
							self.index++;
							self.loadTrack(self.index);
							//self.tracker.slider("option", "max", self.audio.duration);
							var scrollTop = $('#ml_container_'+self.i+' .playlist li.active').position().top; // Autoscrolling
							var mlScrollTo = 100 - Math.ceil((scrollTop / $('#ml_container_'+self.i+' .playlist').outerHeight()) * 100, 10);
							if(self.index == self.trackCount - 1) {
								$('#ml_container_'+self.i+' .slider-vert').slider('value',0);
								}
								else {
								$('#ml_container_'+self.i+' .slider-vert').slider('value',mlScrollTo);
								}
							self.audio.play();
						} 
						else if(!self.randomChecked && (self.index + 1) == self.trackCount) {
							self.audio.pause();
							self.index = 0;
							self.tracker.slider('value',0);
							self.loadTrack(self.index);
							self.tracker.slider("option", "max", self.audio.duration);
							$('#ml_container_'+self.i+' .slider-vert').slider('value',100);
							$('.pl').addClass('hidden');
						}
						else {
							self.loadTrack(self.index);
							self.tracker.slider("option", "max", self.audio.duration);
							var scrollTop = $('#ml_container_'+self.i+' .playlist li.active').position().top; // Autoscrolling
							var mlScrollTo = 100 - Math.ceil((scrollTop / $('#ml_container_'+self.i+' .playlist').outerHeight()) * 100, 10);
							if(self.index == self.trackCount - 1) {
								$('#ml_container_'+self.i+' .slider-vert').slider('value',0);
							}
							else if(self.index == 0) {
								$('#ml_container_'+self.i+' .slider-vert').slider('value',100);
							}
							else {
								$('#ml_container_'+self.i+' .slider-vert').slider('value',mlScrollTo);
							}
							self.audio.play();
						}
					}).bind('timeupdate',function() {
						var current = parseInt(self.audio.currentTime, 10);
						self.tracker.slider('value',current);
					}).get(0);
						
					this.btnPrev = $('.rew').click(function(e) {
						e.preventDefault;
							self.resetNoRepeats();
						if((self.index - 1) > -1) {
							self.index--;
							self.loadTrack(self.index);
							self.tracker.slider("option", "max", self.audio.duration);
							var scrollTop = $('#ml_container_'+self.i+' .playlist li.active').position().top; // Autoscrolling
							var mlScrollTo = 100 - Math.ceil((scrollTop / $('#ml_container_'+self.i+' .playlist').outerHeight()) * 100, 10);
							$('#ml_container_'+self.i+' .slider-vert').slider('value',mlScrollTo);

							if(self.playing) {
								self.audio.play();								
							}
						} else {
							self.audio.pause();
							self.playing = false;
							self.index = 0;
							self.loadTrack(self.index);
							self.tracker.slider('value',0);
								$('#ml_container_'+self.i+' .slider-vert').slider('value',100);
								$('#ml_container_'+self.i+' .pause').addClass('hidden');
								$('#ml_container_'+self.i+' .pl').addClass('hidden');
								$('#ml_container_'+self.i+' .play').removeClass('hidden');
						}
					});
					
					this.btnNext = $('#ml_container_'+self.i+' .fwd').click(function(e) {
						e.preventDefault;
							self.resetNoRepeats();
						if((self.index + 1) < self.trackCount) {
							self.index++;
							self.loadTrack(self.index);
							self.tracker.slider("option", "max", self.audio.duration);
							var scrollTop = $('#ml_container_'+self.i+' .playlist li.active').position().top; // Autoscrolling
							var mlScrollTo = 100 - Math.ceil((scrollTop / $('#ml_container_'+self.i+' .playlist').outerHeight()) * 100, 10);
							if(self.index == self.trackCount - 1) {
							$('#ml_container_'+self.i+' .slider-vert').slider('value',0);
								}
								else {
									$('#ml_container_'+self.i+' .slider-vert').slider('value',mlScrollTo);
									}
							if(self.playing) {
								self.audio.play();								
							}
						} else {
							self.audio.pause();
							self.playing = false;							
							self.index = 0;
							self.loadTrack(self.index);
							self.tracker.slider('value',0);
								$('#ml_container_'+self.i+' .slider-vert').slider('value',100);
								$('#ml_container_'+self.i+' .pause').addClass('hidden');
								$('#ml_container_'+self.i+' .pl').addClass('hidden');
								$('#ml_container_'+self.i+' .play').removeClass('hidden');
						}
					});
					
					this.li = $('#ml_container_'+self.i+' .playlist li').click(function() {
						var id = parseInt($(this).index());
						if(id !== self.index) {
							self.tracker.slider('value',0);
							self.loadTrack(id);
							self.tracker.slider("option", "max", self.audio.duration);
							self.resetNoRepeats();
								$('#ml_container_'+self.i+' .pause').addClass('hidden');
								$('#ml_container_'+self.i+' .pl').addClass('hidden');
								$('#ml_container_'+self.i+' .play').removeClass('hidden');
						}
					});
					
					this.showImageCss = function() {
						if(this.mlImageon != 0) {
							if(this.mlImagepos == 'left' || this.mlImagepos == 'default') {
							$('#ml_container_'+self.i+' .player .cover').css({
											'float':'left',
											'border-top-left-radius':'5px',
											'height':'auto',
											'position':'relative',
											'width':'auto',
											'margin-right':'10px'
											});
							$('#ml_container_'+self.i+' .player .cover img').css({
											'border-top-left-radius':'5px'
											});
							}
							else {
							$('#ml_container_'+self.i+' .player .cover').css({
											'float':'right',
											'border-top-right-radius':'5px',
											'height':'auto',
											'position':'relative',
											'width':'auto',
											'margin-left':'10px'
											});
							$('#ml_container_'+self.i+' .audio_title, .album_title').css({
											'padding-left':'10px'
											});
							$('#ml_container_'+self.i+' .player .cover img').css({
											'border-top-right-radius':'5px'
											});
							}
						}
						else {
							$('#ml_container_'+self.i+' .player .cover img').detach();
							$('#ml_container_'+self.i+' .player').css({'height':'auto','padding-bottom':'10px','padding-left':'10px'});
							}
					};
					
					this.loadTrack = function(id) {
						this.index = id;
						$('#ml_container_'+this.i+' .active').removeClass('active');
						$('#ml_container_'+this.i+' .playlist li:eq(' + id + ')').addClass('active');
						this.mlTitle.html('<span class="preTitle">Song: </span>' + this.tracks[id].name);
						var file_string = this.tracks[id].file;
						var abbr_string = file_string.slice(0, -4);
						this.audio.src = abbr_string + this.mlExtension;
						// $('.player .cover').css({'background-image':'url(' + tracks[id].cover + ')'});
						$('#ml_container_'+this.i+' .player .cover').html('<img id="cover_img" src="' + self.tracks[id].cover + '" title="' + self.tracks[id].name + '" />');
						if(this.tracks[id].album != '') {
							$('#ml_container_'+this.i+' .album_title').html('<span class="preTitle">Album: </span>' + self.tracks[id].album );
						}
						else {
							$('#ml_container_'+this.i+' .album_title').text('');
							}
						var pw = $('#ml_container_'+this.i+' .player').getHiddenDimensions().width;
						
						if(pw > 345) {
							$('#ml_container_'+this.i+' .player').height(self.tracks[id].height);
							$('#ml_container_'+this.i+' .pl').addClass('hidden');
							$('#ml_container_'+this.i+' .audio_title, .album_title').css({'padding-left':'0'});
							$('#ml_container_'+this.i+' .player .cover').removeClass('hidden');
							// Show Image?	
							this.showImageCss();
							}
							else {
								$('#ml_container_'+this.i+' .player').css({'height':'auto','padding-bottom':'10px'});
								$('#ml_container_'+this.i+' .audio_title, .album_title').css({'padding-left':'10px'});
								$('#ml_container_'+this.i+' .player .cover').addClass('hidden');
								}
						this.tracker.slider('option', 'max', self.audio.duration);
					};
					
					this.playTrack = function(id) {
						this.loadTrack(id);
						this.audio.play();
					};

					this.mlExtension = this.audio.canPlayType('audio/mpeg') ? '.mp3' : this.audio.canPlayType('audio/ogg') ? '.ogg' : this.audio.canPlayType('audio/wav') ? '.wav' : '';

					this.audio.volume = this.defaultVol;

					this.tracker.width(this.cw);

					$(window).resize(function() {
						var cw = $('#ml_container_'+self.i).getHiddenDimensions().width;
							$('#ml_container_'+self.i+' .tracker').width(cw);
					});

					this.changeHeight = function(id) {
						this.index = id;
						var pw = $('#ml_container_'+self.i+' .player').getHiddenDimensions().width;
						var ph = $('#ml_container_'+self.i+' .player').getHiddenDimensions().height;
						if(pw > 345) {
							$('#ml_container_'+self.i+' .cover').removeClass('hidden');
							this.showImageCss();
							$('#ml_container_'+self.i+' .pl').addClass('hidden');
							ph = this.tracks[id].height;

							if(this.mlImagepos == 'right') {
							$('#ml_container_'+self.i+' .audio_title, .album_title').css({'padding-left':'10px'});
							}
							else {
							$('#ml_container_'+self.i+' .audio_title, .album_title').css({'padding-left':'0'});
							}

							if($('#ml_container_'+self.i+' .cover').attr('imageon').length != 0) {} else {
								$('#ml_container_'+self.i+' .album_title').css({'padding-bottom':'10px'});
								}

							$('#ml_container_'+self.i+' .player').css({'padding-bottom':'0','height':ph});
						}
						else {
							this.showImageCss();
							$('#ml_container_'+self.i+' .cover').addClass('hidden');
							if(this.mlImageon.length == 0){
								$('#ml_container_'+self.i+' .player').css({'padding-left':'0'});
							}
							$('#ml_container_'+self.i+' .audio_title, #ml_container_'+self.i+' .album_title').css({'padding-left':'10px','padding-bottom':'0'});
							$('#ml_container_'+self.i+' .player').css({'height':'auto','padding-bottom':'10px'});
						}
					}

					if(this.audio.paused) {
						$('#ml_container_'+self.i+' .pl').addClass('hidden');
					}

					/* Functionality for player */
					$('#ml_container_'+self.i+' .pause').bind('click',function() {
						if(self.playing) {
							self.audio.pause();
							self.playing = false;
						}
						else {
							self.audio.play();
							self.playing = true;
						}

						$(this).addClass('hidden');

						$('#ml_container_'+self.i+' .play').removeClass('hidden');
					});

					this.bindMeta = $(self.audio).bind('loadedmetadata',function() {
						var dur = parseInt(self.audio.duration),
							curTime = parseInt(self.audio.currentTime),
							min = Math.floor(dur / 60, 10),
							sec = dur - min * 60,
							curMins = Math.floor(curTime / 60, 10),
							curSecs = Math.floor(curTime % 60);
						
							$('#ml_container_'+self.i+' .timeleft').text(curMins + ' : ' + (curSecs > 9 ? curSecs : '0' + curSecs) + '   |   -' + min + ' : ' + (sec > 9 ? sec : '0' + sec));
							self.tracker.slider('option', 'max', self.audio.duration);
						});

					this.bindUpdate = $(self.audio).bind('timeupdate',function() {
						var songDuration = parseInt(self.audio.duration),
							timeRemaining = parseInt(songDuration - self.audio.currentTime, 10),
							curTime = parseInt(self.audio.currentTime),
							now = (self.audio.currentTime / self.audio.duration) * 100,
							mins = Math.floor(timeRemaining / 60, 10),
							curMins = Math.floor(curTime / 60, 10), 
							seconds = Math.floor(timeRemaining - mins * 60, 10);
							curSecs = Math.floor(curTime % 60);
							
							if(!isNaN(mins) || !isNaN(seconds)){
								$('#ml_container_'+self.i+' .timeleft').text(curMins + ' : ' + (curSecs > 9 ? curSecs : '0' + curSecs) + '   |   -' + mins + ' : ' + (seconds > 9 ? seconds : '0' + seconds));
							}
							self.handle.css({'left': now + '%'}); 
						});

					var plugins_url = this.volume.attr('data-plugins');	
					var opts = this.volume.css('background-image','url(' + plugins_url + '/mlr-audio/css/images/volume_half.png)');

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
					$('#ml_container_'+self.i+' .volume .ui-slider-handle').on('mouseover',function() {
							$(this).parent().attr('title','vol = ' + self.volume.slider('value') + '%');
					});

					/* Change image in volume div depending on handle value */
					$('#ml_container_'+self.i+' .volume .ui-slider-handle').bind('mousedown', function(e){
							$('#ml_container_'+self.i+' .volume .ui-slider-handle').bind('mousemove', function(e){
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

							$('#ml_container_'+self.i+' .volume .ui-slider-handle').bind('mouseup.mlDown',function(e){
								$('#ml_container_'+self.i+' .volume .ui-slider-handle').removeClass('dragged');
								$(this).unbind('mousemove');
							});
						});

					/* Tracker slider */

					this.tracker.slider({
						range: 'min',
						min: 0,
						max: self.audio.duration,
						animate: false,
						slide: function(e,ui) {
							self.audio.currentTime = ui.value;
							},
						});

					this.mlScrollbar = function($scrolled) {
						if(this.mlPlaylistHeight.length !== 0) {
							if(this.mlPlaylistHeight < 200) {
								this.mlPlaylistHeight = 200;
							}	
						}
						else {
							this.mlPlaylistHeight = 200;
						}
						var sbInit = this.mlPlaylistHeight,
							plHeight = $scrolled.getHiddenDimensions().height,
							lockedplHeight = plHeight,
							lockedDiff = lockedplHeight - sbInit,
							hDiff = plHeight - sbInit;
							
							if(hDiff > 0) {
								var prop = hDiff / plHeight,
									handleHeight = Math.ceil((1 - prop) * sbInit);
									handleHeight -= handleHeight%2;
									
									if($scrolled.closest('#pl_wrap').length > 0) {} else {
										$scrolled.wrap('<div id="pl_wrap" class="pl_wrap"></div>');
									}
									
									$('#ml_container_'+self.i+' .pl_wrap').css({'height':''+sbInit+'px','overflow':'hidden','position':'relative'});
									$wrap = $('#ml_container_'+self.i+' .pl_wrap');

									if($wrap.find('#slider_vert_'+self.i).length == 0) {
										$wrap.append('<div id="slider_vert_'+self.i+'" class="slider-vert"></div>');
									}
						
									$('#ml_container_'+self.i+' .slider-vert').slider({
										orientation:'vertical',
										range:'min',
										min:0,
										max:100,
										value:100,
										animate:true,
										slide: function(event, ui) {
											if($scrolled.css('display') != 'none') {
												var tVal = -((100-ui.value)*hDiff/100);
											}
											$scrolled.css({top:tVal});
											$('#ml_container_'+self.i+'  .slider-vert .ui-slider-range').height(ui.value+'%');
										},
										change: function(event, ui) {
											if($scrolled.css('display') != 'none') {	
												var tVal = -((100-ui.value)*hDiff/100);
											}
											if(!$scrolled.is(':animated')) {
												$scrolled.animate({top:tVal},300);
											}
											$('#ml_container_'+self.i+'  .slider-vert .ui-slider-range').height(ui.value+'%');
										}
									});

									var scrollable = sbInit - handleHeight,
										sliderMargin = (sbInit - scrollable)*0.5;
									
									$('#ml_container_'+self.i+'  .slider-vert .ui-slider-handle').css({height:handleHeight,'margin-bottom':-0.5*handleHeight});
									$('#ml_container_'+self.i+'  .slider-vert.ui-slider').css({height:scrollable,'margin-top':sliderMargin});		
							}
							
							$('#ml_container_'+self.i+'  .slider-vert.ui-slider').click(function(event) {
								event.stopPropagation();
							});

					} /* End mlScrollbar */		

					this.mlScrollbar($('#ml_container_'+self.i+' .playlist'));

					/* Window resize */

					$(window).resize(function() {
						self.mlScrollbar($('#ml_container_'+self.i+' .playlist'));
						self.changeHeight(self.index);
						});
					
					/* Playlist toggle */
					
					$.fn.hasParent = function(p) {
						return this.filter(function() {
							return $(p).find(this).length;
						});
					}
	
					var mlPlayerHidden = $('#ml_container_'+self.i+' .player').attr('playhide'),
						mlaPlaylistToggle = function($mldependent) {
	
							if($mldependent.css('display') == 'none') { 
								$('#ml_container_'+self.i+' .ml_audio_toggle_playlist').attr('title','Show playlist');
							}
							else {
								$('#ml_container_'+self.i+' .ml_audio_toggle_playlist').attr('title','Hide playlist');
							}

							$('#ml_container_'+self.i+' .ml_audio_toggle_playlist').bind('click',function(e) {
								e.preventDefault();
								var mlScrollTo;
								$mldependent.slideToggle('slow', function() {
									if($(this).css('display') == 'none') { 
										$('#ml_container_'+self.i+' .ml_audio_toggle_playlist').attr('title','Show playlist');
									}
									else {
										$('#ml_container_'+self.i+' .ml_audio_toggle_playlist').attr('title','Hide playlist');
							
										var scrollTop = $('#ml_container_'+self.i+' .playlist li.active').position().top;
										if(self.index == (self.trackCount - 1)) {
											mlScrollTo = 0;
										}
										else {
											mlScrollTo = 100 - Math.ceil((scrollTop / $('#ml_container_'+self.i+' .playlist').outerHeight()) * 100, 10);
										}
										$('#ml_container_'+self.i+' .slider-vert').slider('value',mlScrollTo);
									}
								});
							});
						}
	
					if($('.playlist').hasParent('#ml_container_'+self.i+' #pl_wrap, #ml_container_'+self.i)) {
						if (typeof(mlPlayerHidden) === "undefined" || mlPlayerHidden == null) {
						} 
						else { 
							if(mlPlayerHidden.length != 0) {
								$('#ml_container_'+self.i+' #pl_wrap').css('display','none');
							}
							mlaPlaylistToggle($('#ml_container_'+self.i+' #pl_wrap'));
						}
					}
		
					if($('.playlist').hasParent('#ml_container_'+self.i)) {
						if (typeof(mlPlayerHidden) === "undefined" || mlPlayerHidden == null) {
						} 
						else {
							if(mlPlayerHidden.length != 0) {
								$('#ml_container_'+self.i+' .playlist').css('display','none');
							}
							mlaPlaylistToggle($('#ml_container_'+self.i+' ul.playlist'));
						}
					}			

				}	/* End if undefined */

			} /* End if supports audio */
			
	}

	function mlAudioAutoPlay(obj) {
		this.obj = obj;
		if((this.obj.auto != undefined && this.obj.auto.length != 0 && mlContainsAllElements.length < 2) || (this.obj.indAuto != undefined && this.obj.indAuto.length != 0 && this.obj.indAuto != 0)) {
			this.obj.loadTrack(this.obj.index);
			this.obj.audio.play();
			this.obj.playing = true;
		}
		else {
			this.obj.loadTrack(this.obj.index);
		}
	}
	
	function mlAudioPauseAllTracks(obj) {
		this.obj = obj;
		if(this.obj.playing) {
			this.obj.audio.pause();
			this.obj.playing = false;
		}
	}
	
	
	
/***************************************
================ SINGLE ================
****************************************/

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
					$('#ml_single_container_'+self.i+' .pause').bind('click',function() {
						if(self.playing) {
							self.audio.pause();
							self.playing = false;
						}
						else {
							self.audio.play();
							self.playing = true;
						}

						$(this).addClass('hidden');

						$('#ml_single_container_'+self.i+' .play').removeClass('hidden');
					});

					this.bindMeta = $(self.audio).bind('loadedmetadata',function() {
						var dur = parseInt(self.audio.duration),
							curTime = parseInt(self.audio.currentTime),
							min = Math.floor(dur / 60, 10),
							sec = dur - min * 60,
							curMins = Math.floor(curTime / 60, 10),
							curSecs = Math.floor(curTime % 60);
						
							$('#ml_single_container_'+self.i+' .timeleft').text(curMins + ' : ' + (curSecs > 9 ? curSecs : '0' + curSecs) + '   |   -' + min + ' : ' + (sec > 9 ? sec : '0' + sec));
							self.tracker.slider('option', 'max', self.audio.duration);
						});

					this.bindUpdate = $(self.audio).bind('timeupdate',function() {
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
							self.handle.css({'left': now + '%'}); 
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
		if((this.obj.auto != undefined && this.obj.auto.length != 0 && (mlSingleContainsAllElements.length + mlContainsAllElements.length) < 2) || (this.obj.indAuto != undefined && this.obj.indAuto.length != 0 && this.obj.indAuto != 0)) {
			this.obj.loadTrack(this.obj.index);
			this.obj.audio.play();
			this.obj.playing = true;
		}
		else {
			this.obj.loadTrack(this.obj.index);
		}
	}
	
	function mlAudioAutoPlay(obj) {
		this.obj = obj;
		if((this.obj.auto != undefined && this.obj.auto.length != 0 && (mlSingleContainsAllElements.length + mlContainsAllElements.length) < 2) || (this.obj.indAuto != undefined && this.obj.indAuto.length != 0 && this.obj.indAuto != 0)) {
			this.obj.loadTrack(this.obj.index);
			this.obj.audio.play();
			this.obj.playing = true;
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
	
	function mlAudioPauseAllTracks(obj) {
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
	
	var mlContainsElements = $('.ml_contains_audio');
	var mlContainsAllElements = [];
	if(mlContainsElements.length) {
		for(var j = 0; j < mlContainsElements.length; j++) {
			mlContainsAllElements[j] = new mlAudioFunc(j+1);
		}
		for(var k = 0; k < mlContainsElements.length; k++) {
			mlAudioAutoPlay(mlContainsAllElements[k]);
		}
	}
	
	$('.ml_single_contains_audio .play').bind('click',function() {
		for(var i = 0; i < mlSingleContainsElements.length; i++) {
			mlAudioSinglePauseAllTracks(mlSingleContainsAllElements[i]);
		}
		for(var j = 0; j < mlContainsElements.length; j++) {
			mlAudioPauseAllTracks(mlContainsAllElements[j]);
		}
		var instance = $(this).parent().parent().parent('.ml_single_contains_audio').attr('ml_instance');
		var currentObj = mlSingleContainsAllElements[parseInt(instance) - 1];
			currentObj.tracker.slider("option", "max", currentObj.audio.duration);
			$(this).addClass('hidden');
			$('#ml_single_container_'+currentObj.i+' .pause').removeClass('hidden');
			currentObj.audio.play();		
			currentObj.playing = true;
	}).bind('timeupdate',function() {
		var current = parseInt(currentObj.audio.currentTime, 10);
			currentObj.tracker.slider('value',current);
	}).get(0);
	
	$('.ml_contains_audio .play').bind('click',function() {
		for(var i = 0; i < mlContainsElements.length; i++) {
			mlAudioPauseAllTracks(mlContainsAllElements[i]);
		}
		for(var j = 0; j < mlSingleContainsElements.length; j++) {
			mlAudioSinglePauseAllTracks(mlSingleContainsAllElements[j]);
		}
		var instance = $(this).parent().parent('.ml_contains_audio').attr('ml_instance');
		var currentObj = mlContainsAllElements[parseInt(instance) - 1];		
			//currentObj.tracker.slider("option", "max", currentObj.audio.duration);
			$(this).addClass('hidden');
			$('#ml_container_'+currentObj.i+' .pause').removeClass('hidden');
			currentObj.audio.play();
			currentObj.playing = true;
	}).bind('timeupdate',function() {
		var current = parseInt(currentObj.audio.currentTime, 10);
			currentObj.tracker.slider('value',current);
	}).get(0);
	
		
}); /* End function */			