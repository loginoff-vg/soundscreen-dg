DG.Control.Soundscreen = DG.RoundControl.extend({

	options: {
		position: 'topright'
	},

	statics: {
		Dictionary: {}
	},

	initialize: function(options) {
		DG.setOptions(this, options || {});
		DG.extend(this, {
			_active: false,
			_geoclickerNeedRestore: false
		}).on(this._controlEvents, this);
	},

	_controlEvents: {
		add: function() {
			if (!this._map.soundscreen) {
				
			} 
		},
		click: function() {

			if (!this._active) {
				try {
					this._map.soundscreen.enable();
				} catch(err) {
					if (this._map.soundscreen.options.debug) {
						console.error(err.message);
						var content = '<h3>Error</h3>' + DG.Soundscreen.tools.objectMap(err, {own: true}).join('<br>');
						this._map.openPopup(content, this._map.getCenter());
						//this._map.openPopup(['Error', err.message, err.fileName, err.lineNumber, err.columnNumber].join('<br>'), this._map.getCenter());
					}
				}
				this.setState('active');
			} else {
				this._map.soundscreen.disable();
				this.setState('');
			}
			this._active = !this._active;
			this._renderTranslation();
		},
		remove: function() {
			this.off(this._controlEvents, this);
			if (this._active) {
				this._map.soundscreen.disable();
				this._active = false;
			}
			this._map.soundscreen = null;
		}
	},

	_renderTranslation: function() { // ()
		this._link.innerHTML = this.t(this._active ? 'off' : 'on');
	}
});

DG.Map.mergeOptions({
	soundscreen: false
});

DG.Map.addInitHook(function() {
	if (this.options.soundscreen) {
		try {
			this.soundscreen = new DG.Soundscreen(this, this.options.soundscreen);
			this._handlers.push(this.soundscreen);
		} catch(err) {
			if (this.options.soundscreen.debug) {
				console.error(err.message, err.fileName, err.lineNumber, err.columnNumber)
			}
			return
		}
		this.soundscreenControl = new DG.Control.Soundscreen(this.options.soundscreen.control);
		this.addControl(this.soundscreenControl);
	}
});
