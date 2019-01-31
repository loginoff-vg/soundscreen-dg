DG.Soundscreen.UnitsCollection = DG.Soundscreen.Collection.extend({

	_name: 'environs',

	update: function() {
		var types = this.soundscreen.settings.get('geodata.requestGeounits') || 'building';
		var params = {
			point: this.soundscreen.position.get('geoquery'),
			type: types,
			radius: this.soundscreen.settings.get('geodata.radius')
		},
		self = this;
		return new Promise(function(res, rej) {
			self.soundscreen.geoservice.request('locate', params)
			.then(function(data) {
				self.setItems(data);
				res(self)
			})
			.catch(function(err) {
				self.clear();
				rej(err)
			})
		})
	},

	sort: function(field) {
		field = field || this.soundscreen.settings.get('geodata.sortOrder') || 'info';
		this._items.sort(function(a, b) {
			return a[field]() - b[field]()
		})
	},

	add: function(data) {

		if (data && data.type) {
			var type = data.type[0].toUpperCase() + data.type.slice(1);
			if (typeof DG.Soundscreen.Geounit[type] == 'function') {
				this._items.push(new DG.Soundscreen.Geounit[type](this.soundscreen, data));
			} else {
				this._items.push(new DG.Soundscreen.Geounit(this.soundscreen, data));
			}
		}
	},

	enter: function(e) {
		var item = this.get();
		if (!item) {
			return this.view();
		}
		if (e.mode.Ctrl && typeof item.click == 'function') {
			return item.click()
		}
		if (e.mode.Shift && typeof item.positionBy == 'function') {
			item.positionBy()
			return this.back();
		}
		if (typeof item.open == 'function') {
			return item.open(this)
		}
		this.view();
	},

});
/*

*/