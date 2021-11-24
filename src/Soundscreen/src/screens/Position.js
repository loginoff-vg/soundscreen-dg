
DG.Soundscreen.Position = DG.Marker.extend({

	_zoomAnimated: false,

	set: function(value) {
		return this.setLatLng(value)
	},

	get: function(format) {
		if (!format) {
			return this._latlng.clone();
		}
		var position = [this._latlng.lat, this._latlng.lng];
		switch (format) {
			case 'array':
			return position;
			case 'string':
			return position.join(',');
			case 'geoquery':
			return position.reverse().join(',');
			//case 'point':
			//return this._map.project(this._latlng);
			default:
			return this._latlng.clone();
		} 
	},

	title: function(message) {
		this._icon.title = message;
	},

	toCenter: function() {
		this._next = this._map.getCenter();
		return this.setLatLng(this._map.getCenter())
	},

	centerBy: function() {
		this._next = this.get();
		return this._map.setView(this.get(), this._map.getZoom(), {animate: false})
	},

	checkBounds: function(latlng) {
		return this._map.getBounds().contains(latlng)
	},

	   move: function(dir, step, noRestrict) {
		this._next = this.get().toSide(dir, step);
		if (!this.checkBounds(this._next)) {
			if (noRestrict) {
				this.moveMap(dir)
			} else {
				this.fire('restrict', {latlng: this._next});
				this._next = this.get();
				return false
			}
		}

		return this.set(this._next);
	},

	moveMap: function(dir) {
		var step, b = this._map.getBounds();
		if (dir == 'Left' || dir == 'Right') {
			step = b.getNorthWest().distanceTo(b.getNorthEast())
		} else {
			step = b.getNorthWest().distanceTo(b.getSouthWest())
		}
var newCenter = this._map.getCenter().toSide(dir, step);
		this._map.setView(newCenter, this._map.getZoom(), {animate: false});
	},

	getEvents: function() {
		return {
			zoom: this.update,
			viewreset: this.update,
			zoomend: this.visibleControl,
			moveend: this.visibleControl
		}
	},

	visibleControl: function(e) {

		if (e.type == 'moveend' && !this.checkBounds(this._next)) {
			this.toCenter();
		}
		if (e.type == 'zoomend' && !this.checkBounds(this.get())) {
			if (this._zoom !== this._map.getZoom()) {
				this.centerBy();
			}
		}
		this._zoom = this._map.getZoom()
	},

	click: function() {
		this._map.fire('click', {latlng: this.get()});
	},

	onAdd: function() {
		DG.Marker.prototype.onAdd.apply(this, arguments);
		this._next = this.get();
		this._zoom = this._mapToAdd.getZoom();
		this.on('click', this.click, this)
	},

	onRemove: function() {
		DG.Marker.prototype.onRemove.apply(this, arguments);
		this.off('click', this.click, this)
	}

});
