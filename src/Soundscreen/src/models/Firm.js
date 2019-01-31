DG.Soundscreen.Firm = DG.Soundscreen.CollectionItem.extend({
/*
	initialize: function(soundscreen, data) {
		DG.Soundscreen.CollectionItem.prototype.initialize.apply(this, arguments);
	},
*/
	getFirmInfo: function() {
		if (this._loaded) {
			return this._loaded
		}
		return this._loaded = this.soundscreen.geoservice.getFirmInfo(this.data.id)
	},

	open: function(caller) {
		if (!caller) {
			return
		}

		this.getFirmInfo()
		.then(function(data) {
			//log(data, {label: 'firmInfo'});
			DG.extend(this.data, data.result.items[0]);
			caller._successor = this.expand(caller);
			caller.ui.setFocus(caller._successor);
		}.bind(this))
		.catch(function() {
			caller._successor = new DG.Soundscreen.Collection(this.soundscreen, {
				caller: caller,
				parent: this,
				name: 'Информация об организации ' + this.name,
			});
			caller.ui.setFocus(caller._successor);
		}.bind(this))
	},

	click: function() {
		this.soundscreen._map.fire('click', {
			latlng: this.coords[0],
			emitter: this
			});
	}

});

/*
		if (!this._detail) {
			
			this._detail = []
		}
		return this._detail;
*/