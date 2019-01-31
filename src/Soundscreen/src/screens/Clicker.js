
DG.Soundscreen.Clicker = DG.Handler.extend({

	initialize: function(soundscreen, onclick) {
		this._map = soundscreen._map;
		this.ui = soundscreen.ui;
		this.locale = new DG.Soundscreen.Locale(this._map);
		this.onclick = onclick || function(data) {
			this.ui.out(data, 2)
		}.bind(this);
		if (!this._map.geoclicker) {
			DG.Util.setOptions(this._map, {
				geoclicker: {
					showRouteSearch: true
				}
			});
			this._map.addHandler('geoclicker', DG.Geoclicker);
		}
		this._origGeoclickerhandleResponse = this._map.geoclicker._controller.handleResponse;
		this._map.geoclicker.enable();
	},

	addHooks: function() {
		this._map.on(this._mapEvents(), this);
		this._map.once('popupopen', function() {
			this.ui.out('Открыто окно с информацией 2ГИС. Для просмотра 2 раза нажмите Tab.', 1);
		}, this);
		this._map.geoclicker._controller.handleResponse = this._render.bind(this);
	},

	removeHooks: function() {
		this._map.off(this._mapEvents(), this);
		this._map.geoclicker._controller.handleResponse = this._origGeoclickerhandleResponse;
	},

	_render: function(result) {
		this.onclick(this.parse(result));
		this._origGeoclickerhandleResponse.call(this._map.geoclicker._controller, result);
	},

	_mapEvents: function() {
		return {
			popupopen: this.onpopupopen,
			popupclose: this.onpopupclose
		}
	},
	onpopupopen: function(e) {
		//this.ui.play('popupopen');
		e.popup.on('contentupdate', this.onpopupupdate, this)
	},

	onpopupclose: function(e) {
		e.popup.off('contentupdate', this.onpopupupdate, this)
		this.ui.play('popupclose');
		this.ui._input.focus();
	},

	onpopupupdate: function() {
		this.ui.play('popupopen');
	},

	parse: function(result) {
		var txt = this.locale.t('no_data'), list = [];
		if (!result || typeof result == 'string') {
			return result || txt;
		}

		for (var key in result) {
			var i = result[key];
			txt = i.name;
			if (!txt) txt = i.reference ? i.reference.name : 'noname';
			list.push(txt)
		}
		txt = list.reverse().join(', ')
		return txt;
	}

});
/*

*/