DG.Soundscreen.MenuItem = DG.Class.extend({

	initialize: function(soundscreen, options) {
		this.soundscreen = soundscreen;
		this.locale = new DG.Soundscreen.Locale(soundscreen._map);
		options = options || {};
		DG.Util.setOptions(this, options);
		this.name = options.name || 'noname';
		this.name = this.locale.t(this.name);
		this.open = options.open || this.open;
		this.value = options.value;
	},

	open: function() {
		
	},

	info: function() {
		return this.name
		//return this.name +': '+ this.data
	},

	toString: function() {
		var checked = this.checked ? this.locale.t('checked') : '';
		return this.info() +' '+ checked;
	}

});
/*

*/