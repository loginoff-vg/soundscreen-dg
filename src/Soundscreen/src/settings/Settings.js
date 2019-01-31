DG.Soundscreen.Settings = DG.Soundscreen.DataStorage.extend({

	options: {},

	initialize: function(soundscreen) {
		this.soundscreen = soundscreen;
		this.config = new DG.Soundscreen.Config();
		this.restore();
		this.setDefaults();
		window.addEventListener('beforeunload', this.store.bind(this))
	},

	getDefault: function(option) {
		var config = typeof option == 'object'? option : this.config.get(option);
		if (!config || config.default === undefined) {
			return ''
		} else {
			return config.default
		}
	},

	setDefaults: function(rewrite) {
		this.config.each(function(option, id, path) {
			var value = this.get(path+'.'+id);
			if (!this.get(path)) {
				this.set(path, {})
			}
			if (rewrite || value === undefined || value === null) {
				this.set(path+'.'+id, this.getDefault(option))
			}
		}.bind(this));
	},

	storageSupported: function() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	},

	store: function() {
		if (this.storageSupported()) {
			localStorage.setItem('soundscreenSettings', JSON.stringify(this.options))
		}
	},

	restore: function() {
		if (!this.storageSupported()) {
			return null
		}
		try {
			return DG.Util.setOptions(this, JSON.parse(localStorage.getItem('soundscreenSettings')))
		} catch (err) {
			return null
		}
	}
	
});