DG.Soundscreen.Tools = DG.Class.extend({

	initialize: function(soundscreen) {
		this._map = soundscreen._map
	},

	azimuth: function(begin, end) {
		return this._map.project(begin).azimuthTo(this._map.project(end))
	}

});
DG.Soundscreen.tools = {
httpGet: function(url, type) {
		return new Promise(function(resolve, reject) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			if (type) {
				request.responseType = type;
			}
			request.onload = function() {
				if (this.status==200) {
					resolve(this.response);
				} else {
					var error = new Error(this.statusText);
					error.code = this.status;
					error.url = url;
					reject(error);
				}
			};
			request.onerror = function() {
				var error = new Error(this.statusText);
				error.code = this.status;
				error.url = url;
				reject(error);
			};
			request.send();
		});
	},

	objectMap: function(o, options) {
		 options = options || {};
		var keys = options.own ? Object.getOwnPropertyNames(o) : Object.keys(o);
		return keys.map(options.callback || function(k) {
			return k + ': ' + o[k]
		})
	},

	createRange: function(min, max, step) {
		min = min || 0;
		max = max || 10;
		step = step || 1;
		var presigion = (''+step%1).length - 2;
		if (presigion< 0) {
			presigion=0
		}
		var result = [];
		for (var i = min; i<= max; i+=step) {
			result.push(+DG.Util.formatNum(i, presigion))
		}
		return result;
	}
};

DG.Point.prototype.azimuthTo = function(point) {
	var delta = DG.point(point).subtract(this);
	return Math.atan2(delta.x, -delta.y);
};
DG.LatLng.prototype.toSide = function(direction, distance) {
		if (!distance) {
			return this.clone()
		}

		var b=this.toBounds(distance*2),
		lat = this.lat, lng = this.lng;

		switch (direction) {
			case 'West':
			case 'Left':
			 lng = b.getWest();
			break;
			case 'North':
			case 'Up':
			 lat = b.getNorth();
			break;
			case 'East':
			case 'Right':
			 lng = b.getEast();
			break;
			case 'South':
			case 'Down':
			 lat = b.getSouth();
			break;
		}

		return new DG.LatLng(lat, lng)
	   };