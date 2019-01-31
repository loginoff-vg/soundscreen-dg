DG.Soundscreen.Geounit.Building = DG.Soundscreen.Geounit.extend({
/*
	initialize: function(soundscreen, data) {
		DG.Soundscreen.Geounit.prototype.initialize.apply(this, arguments);
	},
*/
	getFirms: function() {
		if (this._firms) {
			return this._firms
		}

		return this._firms = this.soundscreen.geoservice.request('firmsInHouse', {houseId: this.data.id})
	},

	open: function(caller) {
		if (!caller) {
			return
		}

		this.getFirms()
		.then(function(data) {
			var items = data.map(function(item) {
				return new DG.Soundscreen.Firm(this.soundscreen, {
					parent: this,
					data: item
				})
			}.bind(this));
			caller._successor = new DG.Soundscreen.Collection(this.soundscreen, {
				caller: caller,
				parent: this,
				name: 'organisation',
				data: items
			});
			caller.ui.setFocus(caller._successor);
		}.bind(this))
		.catch(function() {
			caller._successor = new DG.Soundscreen.Collection(this.soundscreen, {
				caller: caller,
				parent: this,
				name: 'organisation',
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