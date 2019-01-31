
DG.Soundscreen.UI = DG.Layer.extend({

	initialize: function(soundscreen) {
		this._map = soundscreen._map;
		this._lastOut = '';
		this.locale = new DG.Soundscreen.Locale(soundscreen._map);
		this.handler = this;
		this._prevHandler = this;
		if (soundscreen.options.audio) {
			var player = new DG.Soundscreen.Audio(soundscreen.options.audio);
			this.play = player.play.bind(player);
			//this.ui.play('sounds/startup.ogg')
			//player.base64FromURL('soundsqqspeechOff.ogg').then(log);
		} else {
			this.play = function() {return Promise.reject(new Error('Audio is not ready'))}
		}

		this.tts = DG.Soundscreen.getTTS(soundscreen);
	},

	action: function(e) {
		return this.out(e.command+', '+e.code)
	},

	setFocus: function(handler) {
		if (!handler || !handler.action) {
			return false
		}
		if (this.handler.disable) {
			this.handler.disable()
		}
		if (handler.enable) {
			handler.enable()
		}
		this._prevHandler = this.handler;
		this.handler = handler;
		return this
	},

	_setup: function() {},

	_bforeRemove: function() {},

	_events: function() {
		return {}
	},

	onInput: function(e) {
		var processed = false;
		try {
			processed = this.handler.action(e)
		} catch (err) {
			this.soundscreen.fire('error', DG.Util.extend(err, {
				module: 'UI',
				context: this,
				args: arguments,
				comment: 'ui: bad handler'
			}))
			this.setFocus(this._prevHandler);
		}
		if (!processed) {
			this.fire('input', e)
		}
		return processed;
	},

	onAdd: function() {
		this.tts.enable();
		this._container = DG.DomUtil.create('div', 'soundscreen-ui', this.getPane());
		this._setup();
		if (!this._display) {
			this._display = DG.DomUtil.create('div', 'soundscreen-ui-display', this._container);
		}
		if (!this._status) {
			this._status = DG.DomUtil.create('div', 'soundscreen-ui-status', this._container);
		}
		if (this._input) {
			DG.DomEvent.on(this._input, this._events(), this);
		this._input.focus();
		}
	},
	onRemove: function() {
		this._bforeRemove();
		this._lastOut = '';
		DG.DomEvent.off(this._input, this._events(), this);
		DG.DomUtil.remove(this._container);
		this.tts.disable();
	},

	message: function(txt, delay) {
		if (txt == this._lastOut && !this._input.title.endsWith('𝄇')) {
			txt = this._lastOut+'𝄇';
		}

		
		if (delay) {
			setTimeout(this.message.bind(this, txt), 1000);
		} else {
			this._input.setAttribute('title', txt);
		}

	},

	repeatMessage: function() {
		var txt = this._lastOut.replace(/𝄇/, '');
		var prolog=this.locale.t('last_message');
		if (txt.startsWith(prolog)) this.out(txt);
		else this.out(prolog +' '+ txt);
	},

	out: function(msg, priority) {

		if (!msg) {
			msg = this._lastOut
		} else {
			msg = msg.toString()
		}

		if (!this.tts.say(msg, priority)) {
			this.message(msg, priority);
		}
		if (!priority) {
			this._lastOut = msg;
			this._display.innerHTML = msg;
		}
	},

	status: function(txt) {
		this._status.innerHTML = this.locale.t('status') + ': ' + txt;
	},

	pause: function() {
		this._blocked = true;
	},

	resume: function() {
		this._blocked = false;
	}

	
   });
   
   