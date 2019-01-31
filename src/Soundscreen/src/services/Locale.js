
DG.Soundscreen.Locale = function(map) {

	if (DG.Soundscreen.Locale._instance) {
		return DG.Soundscreen.Locale._instance;
	}
	this._map = map;
	DG.Soundscreen.Locale._instance = this;
};
DG.Soundscreen.Locale.prototype = DG.extend({
	constructor: DG.Soundscreen.Locale,
	formatDistance: function(d) {
		return d > 1000 ? this.t('n_km', d/1000) + this.t('n_m', d%1000) : this.t('n_m', d);
	},
	formatAzimuth: function(value, measure) {
		switch (measure) {
			case 'degrees': 
			value = (value/Math.PI*180).toFixed(0);
			if (value < 0) {
				value*=-1;
				return '-' + this.t('n_g', value);
			} else {
				return this.t('n_g', value);
			}
			case 'clock': // clock
			return this.t('n_h', DG.Util.wrapNum((value/Math.PI*6).toFixed(0), [0, 12]));
			case 'windrose': // wind rose
			var i = DG.Util.wrapNum((value/Math.PI*4).toFixed(0), [0, 8]);
			return this.t(this.windrose[i]);
			default: //radian
			return value
		}
	},
	windrose: [
		'North',
		'Northeast',
		'East',
		'Southeast',
		'South',
		'Southwest',
		'West',
		'Northwest'
	]
}, DG.Locale);
DG.Soundscreen.Locale.Dictionary = {};
