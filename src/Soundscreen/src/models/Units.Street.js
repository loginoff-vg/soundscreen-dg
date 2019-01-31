DG.Soundscreen.Geounit.Street = DG.Soundscreen.Geounit.extend({
/*
	initialize: function(soundscreen, data) {
		DG.Soundscreen.Geounit.prototype.initialize.apply(this, arguments);
	},
*/
	getSegments: function() {
		if (this._segments) {
			return this._segments
		}
		this._segments = []
		if (!this.coords || this.coords.length<2) {
			return this._segments
		}
		for (var i=1, len=this.coords.length; i<len; i++) {
			this._segments.push({
				begin: this.coords[i-1],
			end: this.coords[i],
			size: this.coords[i].distanceTo(this.coords[i-1]),
			azimuth: this.soundscreen.tools.azimuth(this.coords[i-1], this.coords[i])
			})
		}
		return this._segments
	},

	length: function() {
		if (this._streetLength) {
			return this._streetLength
		}
		return this._streetLength = this.getSegments().reduce(function(memo, item) {
			return memo + item.size;
		}, 0)
	},

	closest: function() {
		if (this._closest) {
			return this._closest
		}
		//log(this.getSegments(), {label: 'segments'});
		var point = this._map.project(this.position.get());
		this._segment = this.getSegments().reduce(function(memo, item, i) {
			item.beginP = this._map.project(item.begin);
			item.endP = this._map.project(item.end);
			item.distance = DG.LineUtil.pointToSegmentDistance(point, item.beginP, item.endP)
			if (!memo.distance || item.distance < memo.distance) {
				this._segmentIndex = i;
				return item
			}
			return memo
		}.bind(this), {})
		if (this._segment) {
			return this._closest = this._map.unproject(DG.LineUtil.closestPointOnSegment(point, this._segment.beginP, this._segment.endP))
		}
		return this._closest = this.coords[0]
	},

	open: function(caller) {
		if (!caller) {
			return
		}

		caller._successor = this.expand(caller, {
			length: this.length(),
			segments: this.getSegments()
		})
		caller.ui.setFocus(caller._successor);
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