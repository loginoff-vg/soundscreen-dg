DG.Soundscreen.CollectionItem = DG.Class.extend({

	initialize: function(soundscreen, options) {
		this.soundscreen = soundscreen;
		this.locale = new DG.Soundscreen.Locale(soundscreen._map);
		this.options = options || {};
		this.name = this.options.name || '';//this.locale.t('noname');
		this.data = this.options.data;
		if (this.data && this.data.name) {
			this.name = this.data.name
		}
	},

 	expand: function(caller, data) {
		caller = caller || null;
		data = data || this.data;
		if (typeof data == 'object') {
			var items = DG.Soundscreen.tools.objectMap(data, {callback: function(key) {
				return new DG.Soundscreen.CollectionItem(this.soundscreen, {
					parent: this,
					name: key,
					data: data[key]
				})
			}.bind(this)
			})
			return new DG.Soundscreen.Collection(this.soundscreen, {
				parent: this,
				caller: caller,
				name: this.name,
				data: items
			})
		}
		return '';
	},

	menu: function() {
		
	},

	info: function() {
		if (typeof this.data == 'object') {
			return this.name
		}
		return this.name +': '+ this.data
	},

	toString: function() {
		return this.info();
	}

});
/*

*/