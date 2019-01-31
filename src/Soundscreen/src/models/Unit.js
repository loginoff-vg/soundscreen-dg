DG.Soundscreen.Geounit = DG.Soundscreen.CollectionItem.extend({

	initialize: function(soundscreen, data) {
		this.soundscreen = soundscreen;
		this._map = soundscreen._map;
		this.locale = new DG.Soundscreen.Locale(this._map);
		this._settings = soundscreen.settings.get('geodata') || {azimuthFormat: 'degrees'};
		this.position = this.soundscreen.position;
		this.data = data;
		this.name = data.building_name || data.name || data.full_name || data.purpose_name || 'no name';

		if (data.geometry && data.geometry.selection) {
			this.coords = DG.Wkt.toLatLngs(data.geometry.selection)
		}
		this.publicData = {
			name: this.name
		}
		if (data.floors && data.floors.ground_count) {
			this.floors = data.floors.ground_count
		}
	},

	closest: function() {
		if (this.coords) {
			return this.coords[0]
		}
		return null
	},

	azimuth: function() {
		if (this.coords && this.position) {
			return this.soundscreen.tools.azimuth(this.position.get(), this.closest())
		}
		return '';
	},

	distance: function() {
		if (this.coords && this.position) {
			return DG.Util.formatNum(this.position.get().distanceTo(this.closest()),0);
			//return +(this.position.get().distanceTo(this.coords[0])).toFixed(0);
		}
		return '';
	},

	info: function() {
		var underCursor = this.underCursor ? ' ' + this.locale.t('under_cursor') : '';
		return [
		this.name + underCursor,
this.locale.t('to_the') + this.locale.formatAzimuth(this.azimuth(), this._settings.azimuthFormat),
this.locale.formatDistance(this.distance()), // this.locale.t('distance') + 
		].join(', ')
	},

	toString: function() {
		return this.info();
	},

	positionBy: function() {
		if (this.coords && this.position) {
			this.position.set(this.coords[0])
		}
	},

	click: function() {
		this.soundscreen._map.fire('click', {
			latlng: this.coords[0],
			emitter: this
			});
	}

});
/*

*/