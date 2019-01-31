DG.Soundscreen = DG.Handler.extend({

	options: {
		debug: true,
	},

	includes: DG.Mixin.Events,

	initialize: function(map, options) {
		this._map = map;
		DG.Util.setOptions(this, options);
		this.tools = new DG.Soundscreen.Tools(this);
		this.settings = new DG.Soundscreen.Settings(this);

		if (DG.Browser.touchEnabled || DG.Browser.mobile) {
			this.ui = new DG.Soundscreen.Sensor(this);
		} else {
			this.ui = new DG.Soundscreen.keyboard(this);
		}

		this.geoservice = new DG.Soundscreen.Geoservice(map);
		this.position = new DG.Soundscreen.Position(map.getCenter(), {title: 'Soundscreen'});
		this.clicker = new DG.Soundscreen.Clicker(this);
		this.feeler = new DG.Soundscreen.Feeler(this);
		this.settingsControl = new DG.Soundscreen.SettingsControl(this);
		this.fire('info', {
			module: 'Soundscreen',
			context: this,
			comment: 'Init complete'
		});
	},

	addHooks: function() {
		this.clicker.enable();
		this.position.addTo(this._map);
		this.ui.addTo(this._map);
		this.ui.setFocus(this.feeler);
	},

	removeHooks: function() {
		this.feeler.disable();
		this.clicker.disable();
		this.position.remove();
		this.ui.remove();
	}

});
DG.Soundscreen.log =window.log || function() {};